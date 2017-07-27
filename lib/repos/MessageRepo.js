const conf = require("../../conf");
const uuid = require("uuid");
const ms = require("ms");
const utils = require("../utils");

class MessageRepo {

	constructor(db) {
		this.collection = db.collection("messages");
		this.collection.createIndex({
			"created": 1
		}, {
			expireAfterSeconds: ms(conf.persistensTtl) / 1000
		});
		this.collection.createIndex({
			"reqId": 1
		});
		this.collection.createIndex({
			"transactionId": 1
		});
		this.collection.createIndex({
			"id": 1
		}, {
			unique: true
		});
	}

	save(subject, message = {}) {
		// TODO: Consider batch writes to minimze writes

		const isResponse = utils.isResponse(subject);

		let messageWrapper = {
			id: uuid.v4(),
			created: new Date(),
			subject: subject,
			transactionId: message.transactionId,
			reqId: message.reqId,
			message: JSON.stringify(message)
		};

		if(isResponse) {
			messageWrapper.reqSubject = utils.getRequestSubject(subject);
		}

		return this.collection.insert(messageWrapper)
			.then(res => {
				const savedMessage = res.ops[0];

				if (isResponse && messageWrapper.transactionId) {

					setTimeout(() => {
						// Calculate and set transaction time for response
						// but wait some time to give time to request to have 
						// been written (since this sometimes may be picked up 
						// unordered from bus)				
						this._setTransactionTime(savedMessage);
					}, 250);
				}

				return res.ops[0];
			});
	}

	get(id) {
		return this.collection.findOne({
			id: id
		});
	}

	_setTransactionTime(message) {

		this.collection.find({
				transactionId: message.transactionId
			}).toArray()
			.then(transactionMessages => {

				const transactionReq = transactionMessages.find(m => {
					return !utils.isResponse(m.subject);
				});

				if (transactionReq) {
					const timeMs = message.created.getTime() - transactionReq.created.getTime();

					const update = {
						$set: {
							ms: timeMs
						}
					};

					this.collection.update({
						id: message.id
					}, update);
				}
			});
	}
}

module.exports = MessageRepo;