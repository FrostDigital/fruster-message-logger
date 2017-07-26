const log = require("fruster-log");
const conf = require("./conf");
const nats = require("nats");
const health = require("fruster-health");
const mongo = require("mongodb");

const isSingleLine = conf.style == "single-line";

let messageRepo;

let client = nats.connect({
	servers: conf.bus
});

log.info("Connecting to NATS bus", conf.bus);

client.on("connect", ()  => {
	log.info("Successfully connected to NATS bus", conf.bus);

	health.start();

	if (conf.mongoUrl) {
		createMessageRepo(conf.mongoUrl).then(_messageRepo => {
			messageRepo = _messageRepo;
		});
	}

	client.subscribe(conf.logSubject, (msg, reply, subject) => {
		if (conf.excludePattern && matchesPattern(subject, conf.excludePattern)) {
			return;
		}

		if (msg) {
			let json = maskPassword(toJSON(msg));
			log.debug(`[${getSubject(subject)}] ${isSingleLine ? '' : '\n'}${prettyPrintJSON(json)}`);

			if (messageRepo) {
				messageRepo.save(json);
			}
		}
	});
});

client.on("error", function(e) {
	log.error("Error [" + client.options.url + "]: " + e);
});

function createMessageRepo(mongoUrl) {
	mongo.connect(mongoUrl)
		.then(db => new MessageRepo(db));
}

function matchesPattern(str, pattern) {
	if (pattern.indexOf("*") > -1) {
		return new RegExp("^" + pattern.split("*").join(".*") + "$").test(str);
	} else {
		return str == pattern.trim();
	}
}

function toJSON(str)  {
	try {
		return JSON.parse(str);
	} catch (e) {
		return {};
	}
}

function prettyPrintJSON(json) {
		return JSON.stringify(json, null, isSingleLine ? 0 : 2);
	}

function getSubject(subject) {
	return subject.indexOf("_INBOX") === 0 ? "Response (" + subject + ")" : subject;
}

function maskPassword(json)  {
	// TODO: Make this more generic
	if (json && json.data && json.data.password) {
		json.data.password = "***MASKED***";
	}
	return json;
}