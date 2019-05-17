let html;

// memoize the html
module.exports = () => html || global.document ? (html = global.document.documentElement) : undefined;