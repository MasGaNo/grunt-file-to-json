"use strict";
var html_minifier_1 = require("html-minifier");
module.exports = function htmlminifier(htmlContent, options) {
    return html_minifier_1.minify(htmlContent, options);
};
