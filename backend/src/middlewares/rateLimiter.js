
// const rateLimit = require('express-rate-limit');
// const { RedisStore } = require('rate-limit-redis');
// const { createClient } = require('redis');
// const requestIp = require('request-ip'); 

// const redisClient = createClient({
//   url: 'redis://127.0.0.1:6379',
// });

// //docker run -d --name redis-container -p 6379:6379 redis

// redisClient.on('error', (err) => {
//   console.error('Redis Client Error', err);
// });

// const connectRedis = async () => {
//   try {
//     await redisClient.connect();
//     console.log('Redis connected');
//   } catch (err) {
//     console.error('Redis connection error:', err);
//     process.exit(1);
//   }
// };

// connectRedis();

// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, 
//   max: 5, 
//   standardHeaders: true, 
//   legacyHeaders: false, 
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args), 
//   }),
//   handler: (req, res) => {
//     console.log(`Rate limit exceeded for IP: ${req.ip}`);
//     res.status(429).json({
//       success: false,
//       message: 'Too many login attempts. Please try again after 15 minutes.',
//     });
//   },
// });

// const logRequest = (req, res, next) => {
//   const clientIp = requestIp.getClientIp(req); 
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${clientIp}`);
//   next();
// };

// // Step 3: Export the rate limiter and logRequest middleware
// module.exports = { loginLimiter, logRequest };
