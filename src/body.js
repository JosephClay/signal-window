let body;

// memoize the body
module.exports = () => body || global.document ? (body = global.document.body) : undefined;