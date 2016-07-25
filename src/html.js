let html;

// memoize the html
module.exports = () => html || (html = document.documentElement);