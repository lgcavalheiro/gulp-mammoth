const Vinyl = require("vinyl");
const assert = require("assert");
const path = require("path");
const fs = require("fs");

const GM = require("../../src/index");

describe("gulp-mammoth: ", () => {
    let stream;
    let options = {
        styleMap: [
            "p[style-name='Body Text'] => ol.roman-list > li:fresh",
            "p[style-name='Preformatted Text'] => p:fresh",
            "r[style-name='Emphasis'] => i:fresh",
            "r[style-name='Strong Emphasis'] => strong:fresh > i",
        ],
    };
    beforeEach(() => {
        stream = GM.docxToHtml(options);
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

    it("Should log any convertion warnings to console", done => {
        let input = path.resolve(__dirname, "../data/failure.docx");

        stream.on("data", file => {
            assert.strictEqual(file.contents.toString().includes("<p>TEXT TEST</p>"), true);
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

    it("Should apply styleMaps properly", done => {
        let input = path.resolve(__dirname, "../data/styleMap.docx");

        stream.on("data", file => {
            let contents = file.contents.toString();
            assert.strictEqual(contents.includes(`<ol class="roman-list">`), true);
            assert.strictEqual(contents.includes(`<strong><i>Donec ut nulla ligula</i></strong>`), true);
            assert.strictEqual(contents.includes(`<i> Donec pellentesque</i>`), true);
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
});
