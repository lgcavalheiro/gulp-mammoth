const through = require("through2");
const mammoth = require("mammoth");

module.exports = {
    docxToHtml(...options) {
        return through.obj(async (file, encoding, callback, options) => {
            if (file.contents === null) callback(null, file);
            else {
                let { value, messages } = await mammoth.convertToHtml(
                    { path: file.path },
                    options
                );
                if (messages.length == 0)
                    file.contents = Buffer.from(value.toString());
                else file.contents = Buffer.from(messages);
                file.extname = ".html";
                callback(null, file);
            }
        });
    },

    // to be rewritten
    // docxToMarkdown(...options) {
    //     return through.obj(async (file, encoding, callback, options) => {
    //         let { value, messages } = await mammoth.convertToMarkdown({ path: file.path }, options)
    //         if (messages.length == 0) file.contents = Buffer.from(value.toString());
    //         else file.contents = Buffer.from(messages);
    //         file.extname = '.md';
    //         callback(null, file);
    //     })
    // }
};
