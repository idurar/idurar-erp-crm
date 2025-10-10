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

// PDF Generation Libraries - Wrap in try-catch to prevent crashes
let PDFDocument;
try {
  PDFDocument = require('pdfkit');
} catch (error) {
  console.warn('PDFKit not installed. PDF generation will be disabled.');
  console.log('To enable PDF generation, run: npm install pdfkit');
}

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
let redisClient;
try {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
  });
} catch (error) {
  console.warn('Redis not configured properly');
}

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

// ================= PDF GENERATION CONFIGURATION =================

// Paper size configurations
const PAPER_SIZES = {
  'A4': { width: 595.28, height: 841.89 },
  'A3': { width: 841.89, height: 1190.55 },
  'LETTER': { width: 612, height: 792 },
  'LEGAL': { width: 612, height: 1008 },
  'A5': { width: 420.94, height: 595.28 },
  'A6': { width: 297.64, height: 420.94 }
};

// PDF Generation function (only if PDFKit is available)
const generatePDF = PDFDocument ? (data, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const {
        paperSize = 'A4',
        orientation = 'portrait',
        margins = { top: 50, right: 50, bottom: 50, left: 50 },
        title = 'Document',
        includeHeader = true,
        includeFooter = true,
        watermark = null
      } = options;

      // Get paper dimensions
      const paper = PAPER_SIZES[paperSize.toUpperCase()] || PAPER_SIZES.A4;
      
      const doc = new PDFDocument({
        size: [paper.width, paper.height],
        layout: orientation,
        margin: 0, // We'll handle margins manually
        info: {
          Title: title,
          Author: 'IDURAR ERP CRM',
          Subject: 'Generated Document',
          Keywords: 'pdf, erp, crm',
          CreationDate: new Date()
        }
      });

      const chunks = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Set initial position considering margins
      doc.x = margins.left;
      doc.y = margins.top;

      // Add watermark if specified
      if (watermark) {
        doc.save();
        doc.opacity(0.1);
        doc.fontSize(60);
        doc.text(watermark, doc.page.width / 2 - 150, doc.page.height / 2, {
          align: 'center'
        });
        doc.restore();
        doc.opacity(1);
      }

      // Header
      if (includeHeader) {
        doc.fontSize(20)
           .font('Helvetica-Bold')
           .fillColor('#2c3e50')
           .text('IDURAR ERP CRM', margins.left, margins.top, {
             align: 'center',
             width: doc.page.width - margins.left - margins.right
           });
        
        doc.y += 10;
        doc.fontSize(12)
           .font('Helvetica')
           .fillColor('#7f8c8d')
           .text(title, margins.left, doc.y, {
             align: 'center',
             width: doc.page.width - margins.left - margins.right
           });
        
        // Header separator line
        doc.y += 10;
        doc.moveTo(margins.left, doc.y)
           .lineTo(doc.page.width - margins.right, doc.y)
           .strokeColor('#bdc3c7')
           .lineWidth(1)
           .stroke();
        
        doc.y += 20;
      }

      // Main content
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#2c3e50')
         .text('Generated Document', margins.left, doc.y);

      doc.y += 15;

      // Add dynamic content based on data
      if (data.content) {
        doc.fontSize(12)
           .text(data.content, margins.left, doc.y, {
             width: doc.page.width - margins.left - margins.right,
             align: 'left'
           });
        doc.y += 20;
      }

      // Add tables if provided
      if (data.table) {
        generateTable(doc, data.table, margins);
        doc.y += 10;
      }

      // Add summary section
      if (data.summary) {
        generateSummary(doc, data.summary, margins);
      }

      // Footer on each page
      if (includeFooter) {
        const footerY = doc.page.height - margins.bottom - 20;
        
        doc.fontSize(8)
           .font('Helvetica')
           .fillColor('#95a5a6')
           .text(
             `Generated on ${new Date().toLocaleDateString()}`,
             margins.left,
             footerY,
             {
               align: 'center',
               width: doc.page.width - margins.left - margins.right
             }
           );
      }

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
} : null;

// Helper function to generate tables in PDF
const generateTable = (doc, tableData, margins) => {
  try {
    const { headers = [], rows = [] } = tableData;
    if (headers.length === 0) return;
    
    const tableTop = doc.y;
    const columnWidth = (doc.page.width - margins.left - margins.right) / headers.length;
    
    // Table header
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .fillColor('#ffffff');
    
    headers.forEach((header, i) => {
      doc.rect(margins.left + i * columnWidth, tableTop, columnWidth, 20)
         .fill('#3498db');
      
      doc.fillColor('#ffffff')
         .text(header, margins.left + i * columnWidth + 5, tableTop + 5, {
           width: columnWidth - 10,
           align: 'left'
         });
    });

    // Table rows
    doc.font('Helvetica')
       .fontSize(9)
       .fillColor('#2c3e50');
    
    rows.forEach((row, rowIndex) => {
      const rowTop = tableTop + 20 + (rowIndex * 15);
      
      // Ensure we don't go off the page
      if (rowTop > doc.page.height - margins.bottom - 50) {
        doc.addPage();
        doc.y = margins.top;
        return;
      }
      
      row.forEach((cell, cellIndex) => {
        const bgColor = rowIndex % 2 === 0 ? '#f8f9fa' : '#ffffff';
        
        doc.rect(margins.left + cellIndex * columnWidth, rowTop, columnWidth, 15)
           .fill(bgColor);
        
        doc.fillColor('#2c3e50')
           .text(String(cell || ''), margins.left + cellIndex * columnWidth + 5, rowTop + 3, {
             width: columnWidth - 10,
             align: 'left'
           });
      });
    });
    
    doc.y = tableTop + 20 + (rows.length * 15) + 10;
  } catch (error) {
    console.error('Table generation error:', error);
    doc.y += 20;
  }
};

// Helper function to generate summary section
const generateSummary = (doc, summaryData, margins) => {
  try {
    doc.font('Helvetica-Bold')
       .fontSize(12)
       .fillColor('#2c3e50')
       .text('Summary:', margins.left, doc.y);
    
    doc.y += 10;
    
    Object.keys(summaryData).forEach((key, index) => {
      const bgColor = index % 2 === 0 ? '#ecf0f1' : '#ffffff';
      const yPos = doc.y;
      
      // Check if we need a new page
      if (yPos > doc.page.height - margins.bottom - 30) {
        doc.addPage();
        doc.y = margins.top;
      }
      
      doc.rect(margins.left, yPos, doc.page.width - margins.left - margins.right, 20)
         .fill(bgColor);
      
      doc.font('Helvetica-Bold')
         .fillColor('#2c3e50')
         .text(key, margins.left + 10, yPos + 5);
      
      doc.font('Helvetica')
         .fillColor('#7f8c8d')
         .text(String(summaryData[key] || ''), margins.left + 200, yPos + 5);
      
      doc.y = yPos + 25;
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    doc.y += 20;
  }
};

// ================= PDF GENERATION ROUTES =================

// PDF Generation endpoint (only if PDFKit is available)
if (PDFDocument) {
  app.post('/api/generate-pdf', adminAuth.isValidAuthToken, async (req, res) => {
    try {
      const {
        data = {},
        paperSize = 'A4',
        orientation = 'portrait',
        title = 'Generated Document',
        filename = `document-${Date.now()}.pdf`,
        includeHeader = true,
        includeFooter = true,
        watermark = null,
        margins = { top: 50, right: 50, bottom: 50, left: 50 }
      } = req.body;

      // Validate paper size
      if (!PAPER_SIZES[paperSize.toUpperCase()]) {
        return res.status(400).json({
          success: false,
          message: `Invalid paper size. Available options: ${Object.keys(PAPER_SIZES).join(', ')}`
        });
      }

      console.log(`Generating PDF: ${title} (${paperSize}, ${orientation})`);

      const pdfBuffer = await generatePDF(data, {
        paperSize,
        orientation,
        title,
        includeHeader,
        includeFooter,
        watermark,
        margins
      });

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);

      // Send the PDF
      res.send(pdfBuffer);

      // Emit real-time notification
      io.emit('pdf-generated', {
        title,
        filename,
        paperSize,
        orientation,
        timestamp: new Date().toISOString(),
        userId: req.user?.id
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate PDF',
        error: error.message
      });
    }
  });

  // Get available paper sizes
  app.get('/api/paper-sizes', (req, res) => {
    res.json({
      success: true,
      data: Object.keys(PAPER_SIZES).map(size => ({
        name: size,
        dimensions: PAPER_SIZES[size],
        description: `${size} paper size`
      }))
    });
  });

  // PDF Template endpoint
  app.post('/api/generate-pdf/template/:templateName', adminAuth.isValidAuthToken, async (req, res) => {
    try {
      const { templateName } = req.params;
      const templateData = req.body;
      
      const templates = {
        'invoice': generateInvoicePDF,
        'report': generateReportPDF,
        'quotation': generateQuotationPDF,
        'receipt': generateReceiptPDF
      };

      const templateFunction = templates[templateName];
      
      if (!templateFunction) {
        return res.status(404).json({
          success: false,
          message: `Template '${templateName}' not found. Available templates: ${Object.keys(templates).join(', ')}`
        });
      }

      const pdfBuffer = await templateFunction(templateData, req.body.options || {});
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${templateName}-${Date.now()}.pdf"`);
      res.send(pdfBuffer);

    } catch (error) {
      console.error('Template PDF generation error:', error);
      res.status(500).json({
        success: false,
        message: `Failed to generate ${req.params.templateName} PDF`,
        error: error.message
      });
    }
  });

  // Template-specific PDF generators
  const generateInvoicePDF = async (data, options) => {
    return generatePDF({
      content: `INVOICE #${data.invoiceNumber || 'N/A'}`,
      table: {
        headers: ['Item', 'Description', 'Quantity', 'Price', 'Total'],
        rows: data.items || []
      },
      summary: {
        'Subtotal': data.subtotal || '0.00',
        'Tax': data.tax || '0.00',
        'Total': data.total || '0.00'
      }
    }, {
      ...options,
      title: `Invoice ${data.invoiceNumber || ''}`,
      watermark: 'INVOICE'
    });
  };

  const generateReportPDF = async (data, options) => {
    return generatePDF({
      content: `REPORT: ${data.reportTitle || 'Business Report'}`,
      table: {
        headers: data.headers || ['Category', 'Value', 'Notes'],
        rows: data.rows || []
      },
      summary: data.summary || {}
    }, {
      ...options,
      title: data.reportTitle || 'Business Report',
      watermark: 'CONFIDENTIAL'
    });
  };

  const generateQuotationPDF = async (data, options) => {
    return generatePDF({
      content: `QUOTATION #${data.quotationNumber || 'N/A'}`,
      table: {
        headers: ['Service', 'Description', 'Quantity', 'Unit Price', 'Amount'],
        rows: data.services || []
      },
      summary: {
        'Subtotal': data.subtotal || '0.00',
        'Discount': data.discount || '0.00',
        'Total': data.total || '0.00',
        'Valid Until': data.validUntil || 'N/A'
      }
    }, {
      ...options,
      title: `Quotation ${data.quotationNumber || ''}`,
      watermark: 'QUOTATION'
    });
  };

  const generateReceiptPDF = async (data, options) => {
    return generatePDF({
      content: `RECEIPT #${data.receiptNumber || 'N/A'}`,
      table: {
        headers: ['Item', 'Quantity', 'Unit Price', 'Total'],
        rows: data.items || []
      },
      summary: {
        'Payment Method': data.paymentMethod || 'N/A',
        'Amount Paid': data.amountPaid || '0.00',
        'Date': data.date || new Date().toLocaleDateString()
      }
    }, {
      ...options,
      title: `Receipt ${data.receiptNumber || ''}`,
      watermark: 'PAID'
    });
  };
} else {
  console.log('PDF endpoints disabled - PDFKit not installed');
}

// ================= MIDDLEWARE SETUP =================

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
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
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

app.use(limiter);

// Request ID and logging middleware
app.use((req, res, next) => {
  req.id = uuidv4();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
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

// File upload
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  abortOnLimit: true
}));

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
      { url: `http://localhost:${process.env.PORT || 3000}` }
    ]
  },
  apis: ['./routes/**/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    pdfEnabled: !!PDFDocument
  });
});

// Use your routes (make sure these files exist)
app.use('/api', coreAuthRouter);
app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);
app.use('/api', adminAuth.isValidAuthToken, erpApiRouter);
app.use('/public', corePublicRouter);
app.use('/download', coreDownloadRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// ================= SERVER STARTUP =================

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    if (redisClient && redisClient.connect) {
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
📄 PDF Generation: ${PDFDocument ? 'Enabled' : 'Disabled (install pdfkit)'}
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
  if (redisClient && redisClient.quit) {
    await redisClient.quit();
  }
  server.close(() => {
    process.exit(0);
  });
});

// Start the server
startServer();

module.exports = { app, server };