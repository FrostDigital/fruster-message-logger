const conf = require("../conf");
const utils = require("../lib/utils");

describe("Utils", () => {
	it("should anonymize message", () => {
		conf.anonymizeAttributes = ["$..password", "$.data.user.firstName", "$.data.user.address..street", "$.data.user.address..zip"];
		const msg = {
			data: {
				password: "password",
				user: {
					firstName: "firstName",
					lastName: "lastName",
					password: "foo", // <-- test if recursive matching works
					address: [{
						street: "street",
						zip: 12345,
						country: "Sweden",
					},
					{
						zip: 12345,
						country: "Sri Lanka",
					}]
				}
			}
		 }

		const res = utils.anonymizeMessage(msg);


		expect(res).toEqual({
			data: {
				password: utils.MASKED,
				user: {
					firstName: utils.MASKED,
					lastName: "lastName",
					password: utils.MASKED,
					address: [{
						street: utils.MASKED,
						zip: 0,
						country: "Sweden",
					},
					{
						// street: utils.MASKED,
						zip: 0,
						country: "Sri Lanka",
					}]
				}
			}
		});
	});
});

