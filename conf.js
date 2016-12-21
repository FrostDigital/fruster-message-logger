module.exports = {
  
  // NATS servers, set multiple if using cluster
  // Example: `['nats://10.23.45.1:4222', 'nats://10.23.41.8:4222']`
  bus: parseArray(process.env.BUS) || ['nats://localhost:4222'],

  logSubject: process.env.LOG_SUBJECT || '>',

  // Wildcard pattern for subjects to exclude, for example "health.*"
  excludePattern: process.env.EXCLUDE || null
};

function parseArray(str) {
  if(str) {
    return str.split(',');
  }
  return null;
}
