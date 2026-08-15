const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fileUpload = require('express-fileupload');
const http = require('http');
const socketIo = require('socket.io');
const redis = require('redis');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoSanitize = require('express-mongo-sanitize');
const { v4: uuidv4 } = require('uuid');

// Route imports
const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const erpApiRouter = require('./routes/appRoutes/appApi');

// Middleware imports
const adminAuth = require('./controllers/coreControllers/adminAuth');
const errorHandlers = require('./handlers/errorHandlers');

const app = express();
const server = http.createServer(app);

// Initialize Redis client (optional - remove if not using Redis)
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.log('Redis Client Error', err);
});

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: true,
    credentials: true
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.set('io', io);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Comprehensive API documentation'
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 3000}`, description: 'Development server' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/**/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// ================= MIDDLEWARE SETUP =================

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Adjust based on your needs
}));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173'
    ];
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    // Different limits for different user types
    if (req.user?.isPremium) return 1000;
    if (req.user) return 100;
    return 50; // Anonymous users
  },
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  skip: (req) => {
    // Skip rate limiting for certain paths
    return req.path === '/health' || req.path.startsWith('/api-docs');
  }
});

// Request ID and logging middleware
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ID: ${req.id}`);
  
  // Capture response finish for logging
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// Timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000, () => {
    console.log(`Request timeout for ${req.method} ${req.originalUrl}`);
  });
  
  res.setTimeout(30000, () => {
    console.log(`Response timeout for ${req.method} ${req.originalUrl}`);
    if (!res.headersSent) {
      res.status(503).json({
        success: false,
        message: 'Request timeout'
      });
    }
  });
  
  next();
});

// Body parsing middleware
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization
app.use(mongoSanitize());

// Compression
app.use(compression());

// File upload configuration
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  abortOnLimit: true,
  createParentPath: true,
  useTempFiles: false // Set to true for large files
}));

// Apply rate limiting to API routes
app.use('/api', limiter);

// ================= ROUTES SETUP =================

// Public routes (no authentication required)
app.use('/api', coreAuthRouter); // Authentication routes (login, register, etc.)
app.use('/public', corePublicRouter); // Public assets
app.use('/download', coreDownloadRouter); // Public downloads

// API Documentation (public)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint (public)
app.get('/health', async (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  };

  // Check Redis connection if enabled
  if (redisClient.isOpen) {
    try {
      await redisClient.ping();
      healthCheck.redis = 'connected';
    } catch (error) {
      healthCheck.redis = 'disconnected';
      healthCheck.status = 'DEGRADED';
    }
  }

  res.status(200).json(healthCheck);
});

// System metrics endpoint (protected)
app.get('/api/system-metrics', adminAuth.isValidAuthToken, (req, res) => {
  const os = require('os');
  
  const metrics = {
    timestamp: new Date().toISOString(),
    process: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      pid: process.pid
    },
    system: {
      loadAverage: os.loadavg(),
      freeMemory: os.freemem(),
      totalMemory: os.totalmem(),
      cpuCount: os.cpus().length,
      platform: os.platform()
    },
    connections: {
      // Socket.io metrics can be added here
    }
  };

  res.json(metrics);
});

// Protected routes (authentication required)
app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);
app.use('/api', adminAuth.isValidAuthToken, erpApiRouter);

// File upload endpoint (protected)
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
    }
  }
});

app.post('/api/upload', adminAuth.isValidAuthToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  res.json({
    success: true,
    message: 'File uploaded successfully',
    file: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    }
  });
});

// Webhook endpoint example (public but with signature verification)
const crypto = require('crypto');

const verifyWebhookSignature = (req, res, next) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET || 'your-webhook-secret')
    .update(payload)
    .digest('hex');
    
  if (signature !== expectedSignature) {
    return res.status(401).json({ 
      success: false,
      error: 'Invalid webhook signature' 
    });
  }
  
  next();
};

app.post('/webhooks/payment', 
  express.raw({type: 'application/json'}), 
  verifyWebhookSignature,
  (req, res) => {
    const event = JSON.parse(req.body);
    
    // Process webhook event
    console.log('Received payment webhook:', event);
    
    // Emit real-time update via Socket.io
    io.emit('payment-update', event);
    
    res.json({ 
      success: true,
      received: true 
    });
  }
);

// Language switching endpoint (public)
const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'es', 'fr'],
  directory: __dirname + '/locales',
  defaultLocale: 'en',
  cookie: 'locale',
  autoReload: true
});

app.use(i18n.init);

app.post('/api/language', (req, res) => {
  const { locale } = req.body;
  const supportedLocales = ['en', 'es', 'fr'];
  
  if (supportedLocales.includes(locale)) {
    res.cookie('locale', locale, { 
      maxAge: 900000, 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    res.json({ 
      success: true,
      message: 'Language changed successfully',
      locale 
    });
  } else {
    res.status(400).json({ 
      success: false,
      error: 'Unsupported language' 
    });
  }
});

// Cache middleware (Redis-based)
const cacheMiddleware = (duration = 300) => { // 5 minutes default
  return async (req, res, next) => {
    if (req.method !== 'GET' || !redisClient.isOpen) return next();
    
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        console.log(`Cache hit for: ${req.originalUrl}`);
        return res.json(JSON.parse(cachedData));
      }
      
      // Override res.json to cache response
      const originalJson = res.json;
      res.json = function(data) {
        if (res.statusCode === 200) {
          redisClient.setEx(key, duration, JSON.stringify(data))
            .catch(err => console.error('Redis set error:', err));
        }
        originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Example cached route
app.get('/api/products', cacheMiddleware(600), (req, res) => {
  // Your product fetching logic here
  res.json({
    success: true,
    data: [], // Your products data
    message: 'Products fetched successfully'
  });
});

// ================= ERROR HANDLING =================

// 404 handler - should come after all routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    requestId: req.id
  });
});

// Error handlers
app.use(errorHandlers.notFound);
app.use(errorHandlers.productionErrors);

// ================= SERVER STARTUP =================

const PORT = process.env.PORT || 3000;

// Initialize Redis and start server
async function startServer() {
  try {
    if (redisClient.isOpen) {
      await redisClient.connect();
      console.log('Redis connected successfully');
    }
    
    server.listen(PORT, () => {
      console.log(`
🚀 Server is running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📚 API Docs: http://localhost:${PORT}/api-docs
❤️ Health Check: http://localhost:${PORT}/health
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
  
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

module.exports = { app, server, startServer };

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}