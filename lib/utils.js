let utils = module.exports;

/**
 * Check if subject is a response to a request.
 *
 * Is compatible with NATS default response subject (starts with `_INBOX`) 
 * and newer Fruster bus syntax (starts with `res.`)
 * @param  {string} subject
 * @return {boolean}
 */
utils.isResponse = (subject) => {
	return subject.indexOf("_INBOX") === 0 || subject.indexOf("res.") === 0;
};

/**
 * Extracts request subject from a response subject of format:
 *
 * `res.{transactionId}.{request subject}`
 * @param  {String} responseSubject 
 * @return {String} request subject or null if it could not be extracted
 */
utils.getRequestSubject = (responseSubject) => {
	if(responseSubject.indexOf("res.") === 0) {
		// Remove prefix "res.{transactionID}" to get request subject
		let split = responseSubject.split(".");
		split.splice(0, 2);
		return split.join("."); 
	}
	return null;
};