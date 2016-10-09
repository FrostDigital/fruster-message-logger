const conf = require('./conf');
const nats = require('nats');
const health = require('fruster-health');

var client = nats.connect({servers: conf.bus});

console.log('Connecting to NATS bus', conf.bus);

client.on('connect', function() {
  console.log('Successfully connected to NATS bus', conf.bus);

  health.setAlive(true);

  client.subscribe(conf.logSubject, function(msg, reply, subject) {  
    if(msg) {
      var json = maskPassword(toJSON(msg));
      console.log('[' + getSubject(subject) + ']\n' + prettyPrintJSON(json));
    }
  });
  
  function toJSON(str) {
    try {
      return JSON.parse(str);
    } catch(e) {
      return {};
    }
  }

  function prettyPrintJSON(json) {
    return JSON.stringify(json, null, 2);
  }

  function getSubject(subject) {
    return subject.indexOf('_INBOX') === 0 ? 'Response (' + subject + ')' : subject;
  }

  function maskPassword(json) {   
    // TODO: Make this more generic
    if(json && json.data && json.data.password) {
      json.data.password = '***MASKED***';
    }
    return json;
  }
});

client.on('error', function(e) {
  log.error('Error [' + client.options.url + ']: ' + e);  

  health.setAlive(false);
});  


