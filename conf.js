module.exports = {
  
  // NATS servers URL
  // Example: `nats://10.23.45.1:4222`
  bus: process.env.BUS || "nats://localhost:4222",

  // Optional URL to mongo db database.
  // If not set, messages will not be persisted
  mongoUrl: process.env.MONGO_URL || null,

  // For how long messages will be persisted
  // Only applicable if `MONGO_URL` is set
  persistensTtl: process.env.PERSISTENS_TTL || "30d",
  
  // Subject to listen to
  logSubject: process.env.LOG_SUBJECT || ">",

  // Wildcard pattern for subjects to exclude, for example "health.*"
  excludePattern: process.env.EXCLUDE || null,

  // Log style enum `single-line|multiple-lines`
  style: process.env.STYLE || "single-line"

};
