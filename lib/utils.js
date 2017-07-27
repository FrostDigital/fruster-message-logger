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
