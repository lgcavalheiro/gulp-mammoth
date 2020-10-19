const PluginError = require("plugin-error");

const convertLiterals = require("./converts");

const PLUGIN_NAME = "gulp-mammoth";

module.exports = function (convertTo, options) {
    if (!convertLiterals[convertTo.toLowerCase()]) throw new PluginError(PLUGIN_NAME, "Invalid convertion format.");
    else return convertLiterals[convertTo.toLowerCase()](options);
};
