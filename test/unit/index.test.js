const Vinyl = require("vinyl");
const assert = require("assert");
const path = require("path");
const fs = require("fs");

const gulpMammoth = require("../../src/index");

describe("Index tests - gulp-mammoth: ", () => {
    it("Should default to html convertion if first argument is invalid", done => {
        let stream = gulpMammoth("invalid-argument");
        let input = path.resolve(__dirname, "../data/nonEmpty.docx");

        stream.on("data", file => {
            assert.strictEqual(file.history.length, 2);
            assert.strictEqual(file.extname, ".html");
            assert.strictEqual(file.contents.toString(), "<p>This is</p><p>a non-empty</p><p>.docx file</p>");
        });

        stream.on("end", () => {
            done();
        });

        let testFile = new Vinyl({
            path: input,
            contents: fs.createReadStream(input),
        });

        stream.write(testFile);
        stream.end();
    });

    it("Should convert to html if first argument is 'html'", done => {
        let stream = gulpMammoth("html");
        let input = path.resolve(__dirname, "../data/nonEmpty.docx");

        stream.on("data", file => {
            assert.strictEqual(file.history.length, 2);
            assert.strictEqual(file.extname, ".html");
            assert.strictEqual(file.contents.toString(), "<p>This is</p><p>a non-empty</p><p>.docx file</p>");
        });

        stream.on("end", () => {
            done();
        });

        let testFile = new Vinyl({
            path: input,
            contents: fs.createReadStream(input),
        });

        stream.write(testFile);
        stream.end();
    });

    it("Should convert to markdown if first argument is 'md'", done => {
        let stream = gulpMammoth("md");
        let input = path.resolve(__dirname, "../data/nonEmpty.docx");

        stream.on("data", file => {
            assert.strictEqual(file.history.length, 2);
            assert.strictEqual(file.extname, ".md");
            assert.strictEqual(file.contents.toString(), `This is\n\na non\\-empty\n\n\\.docx file\n\n`);
        });

        stream.on("end", () => {
            done();
        });

        let testFile = new Vinyl({
            path: input,
            contents: fs.createReadStream(input),
        });

        stream.write(testFile);
        stream.end();
    });
});
