# Fruster Message Logger

Simple message logger that (by default) picks up all message on bus and log them.

Can optionally persist messages to database by setting `MONGO_URL` in config.

## Run

Install dependencies:

    npm install

Start locally:

    npm start

## Configuration

Configuration is set with environment variables. All config defaults to values that makes sense for development.
    
    # Applications log level (error|warn|info|debug|trace)
    LOG_LEVEL = "debug"
    
    # NATS servers, set multiple if using cluster
    # Example: `"nats://10.23.45.1:4222,nats://10.23.41.8:4222"`
    BUS = "nats://localhost:4222"
        
    # NATS subject to log
    LOG_SUBJECT = ">"
    
    # Optional host and port of (remote) syslog, use this to log directly to papertrail
    # Example: `localhost:8272`
    SYSLOG = null
    
    # Name/title of syslog
    SYSLOG_NAME = "Fruster msg logger"
    
    # Optional URL to mongo database to persist messages
    MONGO_URL = null
    
    
