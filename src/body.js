let body;

// memoize the body
module.exports = () => body || (body = document.body);