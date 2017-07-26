const conf = require("../../conf");
const uuid = require("uuid");
const ms = require("ms");

class MessageRepo {

	constructor(db) {
		this.collection = db.collection("messages");
		this.collection.createIndex( { "created": 1 }, { expireAfterSeconds: ms(conf.persistensTtl)/1000 } );
		this.collection.createIndex( { "reqId": 1 });
		this.collection.createIndex( { "transactionId": 1 });
		this.collection.createIndex( { "id": 1 }, { unique: true });		
	}

	save(subject, message) {
		// TODO: Consider batch writes to minimze		
		message.id = uuid.v4();
		message.subject = subject; 
		message.created = new Date();
		return this.collection.insert(message)
			.then(res => res.ops[0]);
	}

}

module.exports = MessageRepo;