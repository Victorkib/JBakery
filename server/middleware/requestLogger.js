import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Request logger middleware
const requestLogger = (req, res, next) => {
  // Skip logging for static files and health checks
  if (req.url.startsWith('/public') || req.url === '/api/health') {
    return next();
  }

  const start = Date.now();
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip =
    req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const userId = req.user ? req.user._id : 'unauthenticated';

  // Log request
  const requestLog = `[${timestamp}] REQUEST: ${method} ${url} - User: ${userId} - IP: ${ip} - UserAgent: ${userAgent}\n`;

  // Create a log file for each day
  const today = new Date().toISOString().split('T')[0];
  const logFile = path.join(logsDir, `${today}.log`);

  fs.appendFile(logFile, requestLog, (err) => {
    if (err) console.error('Error writing to request log:', err);
  });

  // Capture the response
  const originalSend = res.send;
  res.send = function (body) {
    const duration = Date.now() - start;
    const responseLog = `[${timestamp}] RESPONSE: ${method} ${url} - Status: ${res.statusCode} - Duration: ${duration}ms - User: ${userId}\n`;

    fs.appendFile(logFile, responseLog, (err) => {
      if (err) console.error('Error writing to response log:', err);
    });

    // Log errors separately
    if (res.statusCode >= 400) {
      const errorLog = `[${timestamp}] ERROR: ${method} ${url} - Status: ${
        res.statusCode
      } - User: ${userId} - IP: ${ip} - Body: ${
        typeof body === 'string' ? body : JSON.stringify(body)
      }\n`;

      const errorLogFile = path.join(logsDir, 'errors.log');
      fs.appendFile(errorLogFile, errorLog, (err) => {
        if (err) console.error('Error writing to error log:', err);
      });
    }

    return originalSend.call(this, body);
  };

  next();
};

export default requestLogger;
