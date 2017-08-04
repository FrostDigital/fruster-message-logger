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

	it("should save transaction and set response time", (done) => {
		const reqSubject = "fake-request";
		const req = {
			reqId: "aa8a4fc1-cb3f-4329-8bf4-3a0f31fbd61f",
			transactionId: "5143721d-f46a-4f39-8506-89f5f85acd35",
			data: {},
			from: {
				service: "service",
				instanceId: "instanceId"
			}
		};

		const resSubject = "res." + req.transactionId + "." + reqSubject;
		const res = {
			reqId: req.reqId,
			transactionId: req.transactionId
		};

		messageRepo.save(reqSubject, req)
			.then(savedReq => {
				expect(savedReq.id).toBeDefined();
				expect(savedReq.created).toBeDefined();
				expect(savedReq.subject).toBe(reqSubject);
				expect(savedReq.reqId).toBe(req.reqId);
				expect(savedReq.message).toBeDefined();
				expect(savedReq.from.service).toBe("service");
				expect(savedReq.from.instanceId).toBe("instanceId");
			});

		messageRepo.save(resSubject, res)
			.then(wait)
			.then(savedRes => messageRepo.get(savedRes.id))
			.then(savedResWithTime => {				
				expect(savedResWithTime.reqSubject).toBe(reqSubject);
				expect(savedResWithTime.ms).toBeGreaterThan(0);
				done();
			});
	});
});

function wait(o) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(o);
		}, 500);
	});
}