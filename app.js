const log = require("fruster-log");
const conf = require("./conf");
const nats = require("nats");
const health = require("fruster-health");
const mongo = require("mongodb");
const MessageRepo = require("./lib/repos/MessageRepo");
const utils = require("./lib/utils");

const isSingleLine = conf.style == "single-line";
const PRIVATE_PREFIX = "_private";

let messageRepo;

let client = nats.connect({
	servers: [conf.bus]
});

log.info("Connecting to NATS bus", conf.bus);

client.on("connect", () => {
	log.info("Successfully connected to NATS bus", conf.bus);

	health.start();

	if (conf.mongoUrl) {
		createMessageRepo(conf.mongoUrl).then(_messageRepo => {
			messageRepo = _messageRepo;
		});
	}

	client.subscribe(conf.logSubject, (msg, reply, subject) => {
		if (
			(conf.excludePattern && matchesPattern(subject, conf.excludePattern)) ||
			subject.indexOf(PRIVATE_PREFIX) === 0
		) {
			return;
		}

		if (msg) {
			let json = maskPassword(toJSON(msg));
			log.debug(`[${formatSubject(subject)}] ${isSingleLine ? "" : "\n"}${prettyPrintJSON(json)}`);

			if (messageRepo) {
				messageRepo.save(subject, json);
			}
		}
	});
});

client.on("error", function(e) {
	log.error("Error [" + client.options.url + "]: " + e);
});

function createMessageRepo(mongoUrl) {
	return mongo.connect(mongoUrl).then(db => {
		log.info("Successfully connected to database");
		return new MessageRepo(db);
	});
}

function matchesPattern(str, pattern) {
	if (pattern.indexOf("*") > -1) {
		return new RegExp("^" + pattern.split("*").join(".*") + "$").test(str);
	} else {
		return str == pattern.trim();
	}
}

function toJSON(str) {
	try {
		return JSON.parse(str);
	} catch (e) {
		return {};
	}
}

function prettyPrintJSON(json) {
	return JSON.stringify(json, null, isSingleLine ? 0 : 2);
}

function formatSubject(subject) {
	return utils.isResponse(subject) ? "Response (" + subject + ")" : subject;
}

function maskPassword(json = {}) {
	json.data = json.data || {};

	if (json.data.password) {
		json.data.password = "***MASKED***";
	}

	if (json.data.newPassword) {
		json.data.newPassword = "***MASKED***";
	}

	if (json.data.confirmPassword) {
		json.data.confirmPassword = "***MASKED***";
	}

	return json;
}
