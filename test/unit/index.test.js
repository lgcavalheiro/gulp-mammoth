const Vinyl = require("vinyl");
const assert = require("assert");
const path = require("path");
const fs = require("fs");

const GM = require("../../src/index");

describe("gulp-mammoth: ", () => {
    let stream;

    beforeEach(() => {
        stream = GM.docxToHtml();
    });

    it("Should ignore file if its content is equal to null", done => {
        stream.on("data", file => {
            assert.strictEqual(file.isNull(), true);
        });

        stream.on("end", () => {
            done();
        });

        let testFile = new Vinyl({
            contents: null,
        });

        stream.write(testFile);
        stream.end();
    });

    it("Should have content length equal to 0 if input file is empty", done => {
        let input = path.resolve(__dirname, "../data/empty.docx");

        stream.on("data", file => {
            assert.strictEqual(file.contents.toString().length, 0);
            assert.strictEqual(file.isNull(), false);
        });

        stream.on("end", () => {
            done();
        });

        let testFile = new Vinyl({
            path: input,
            contents: fs.readFileSync(input),
        });

        stream.write(testFile);
        stream.end();
    });

    it("Should parse .docx to .html", done => {
        let input = path.resolve(__dirname, "../data/nonEmpty.docx");

        stream.on("data", file => {
            assert.strictEqual(file.history.length, 2);
            assert.strictEqual(file.extname, ".html");
            assert.strictEqual(
                file.contents.toString(),
                "<p>This is</p><p>a non-empty</p><p>.docx file</p>"
            );
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

    it("Should add any error messages to output file instead of actual text content", done => {
        let input = path.resolve(__dirname, "../data/failure.docx");

        stream.on("data", file => {
            assert.strictEqual(
                file.contents.toString(),
                `warning : An unrecognised element was ignored: v:fill\n,warning : An unrecognised element was ignored: v:stroke\n,warning : Unrecognised paragraph style: 'Illustration' (Style ID: Illustration)\n`
            );
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
