const testUtils = require("fruster-test-utils");
const MessageRepo = require("../lib/repos/MessageRepo");

describe("MessageRepo", () => {
	
	let messageRepo;

	testUtils.startBeforeEach({
		mongoUrl: "mongodb://localhost:27017/fruster-message-logger",
		afterStart: (conn) => {
			messageRepo = new MessageRepo(conn.db);
		}
	});

	it("should save message", (done) => {		
		const subject = "fake-subject";
		const message = {
			reqId: "aa8a4fc1-cb3f-4329-8bf4-3a0f31fbd61f",
			transactionId: "5143721d-f46a-4f39-8506-89f5f85acd35",
			data: {}
		};

		messageRepo.save(subject, message)
			.then(savedMessage => {				
				expect(savedMessage.id).toBeDefined();
				expect(savedMessage.created).toBeDefined();
				expect(savedMessage.subject).toBe(subject);
				expect(savedMessage.reqId).toBe(message.reqId);				
				done();
			});
	});
});