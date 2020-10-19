const convertLiterals = require("./converts");

module.exports = function (convertTo, options) {
    if (!convertLiterals[convertTo.toLowerCase()]) return convertLiterals.html(options);
    else return convertLiterals[convertTo.toLowerCase()](options);
};
