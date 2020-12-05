const through = require("through2");
const mammoth = require("mammoth");
const PluginError = require("plugin-error");

const PLUGIN_NAME = "gulp-mammoth";

const convertLiterals = {
    html(options) {
        return through.obj(async (file, encoding, callback) => {
            if (file.contents === null) callback(null, file);
            else {
                let { value, messages } = await mammoth.convertToHtml({ path: file.path }, options);
                file = handleFileContents(file, ".html", value, messages);
                callback(null, file);
            }
        });
    },
    md(options) {
        return through.obj(async (file, encoding, callback) => {
            if (file.contents === null) callback(null, file);
            else {
                let { value, messages } = await mammoth.convertToMarkdown(
                    { path: file.path },
                    options
                );
                file = handleFileContents(file, ".md", value, messages);
                callback(null, file);
            }
        });
    },
    txt() {
        return through.obj(async (file, encoding, callback) => {
            if (file.contents === null) callback(null, file);
            else {
                let { value, messages } = await mammoth.extractRawText({ path: file.path });
                file = handleFileContents(file, ".txt", value, messages);
                callback(null, file);
            }
        });
    },
};

function printWarnings(messages) {
    console.warn(
        PLUGIN_NAME,
        ": Some warnings happened during convertion\n",
        messages
            .map(m => {
                return `${m.type} : ${m.message}\n`;
            })
            .toString()
    );
}

function handleFileContents(file, ext, value, messages) {
    file.contents = Buffer.from(value.toString());
    if (messages.length > 0) printWarnings(messages);
    file.extname = ext;
    return file;
}

module.exports = function (convertTo, options) {
    if (!convertLiterals[convertTo.toLowerCase()])
        throw new PluginError(PLUGIN_NAME, "Invalid convertion format.");
    else return convertLiterals[convertTo.toLowerCase()](options);
};
