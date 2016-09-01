# Fruster Message Logger

Simple message logger that (by default) picks up all message on bus and log them.

## Run

Install dependencies:

    npm install

Start server:

    npm start

## Configuration

Configuration is set with environment variables. All config defaults to values that makes sense for development.
    
    # Applications log level (error|warn|info|debug|silly)
    LOG_LEVEL = "debug"
    
    # NATS servers, set multiple if using cluster
    # Example: `"nats://10.23.45.1:4222,nats://10.23.41.8:4222"`
    BUS = "nats://localhost:4222"
        
    # NATS subject to log
    LOG_SUBJECT = ">"
    
