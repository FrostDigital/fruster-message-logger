module.exports = {
  
  // NATS servers, set multiple if using cluster
  // Example: `['nats://10.23.45.1:4222', 'nats://10.23.41.8:4222']`
  bus: parseArray(process.env.BUS) || ['nats://localhost:4222'],

  // Applications log level (error|warn|info|debug|silly)
  logLevel: parseLogLevel(process.env.LOG_LEVEL) || 'debug',

  logSubject: process.env.LOG_SUBJECT || '>'
  
};

function parseArray(str) {
  if(str) {
    return str.split(',');
  }
  return null;
}

function parseLogLevel(str) {
  if(str) {
    // align log level naming so trace -> silly (which is winston specific)
    return str.toLowerCase() === 'trace' ? 'silly' : str;    
  }
}