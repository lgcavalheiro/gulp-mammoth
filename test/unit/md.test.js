const Vinyl = require("vinyl");
const assert = require("assert");
const path = require("path");
const fs = require("fs");

const gulpMammoth = require("../../src/index");

describe("Markdown convertion tests: ", () => {
    let stream;
    let options = {
        styleMap: [
            "p[style-name='Body Text'] => ol > li:fresh",
            "p[style-name='Preformatted Text'] => p:fresh",
            "r[style-name='Emphasis'] => em:fresh",
            "r[style-name='Strong Emphasis'] => strong:fresh > em",
        ],
    };

    beforeEach(() => {
        stream = gulpMammoth("md", options);
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

    it("Should parse .docx to .md", done => {
        let input = path.resolve(__dirname, "../data/nonEmpty.docx");

        stream.on("data", file => {
            assert.strictEqual(file.history.length, 2);
            assert.strictEqual(file.extname, ".md");
            assert.strictEqual(file.contents.toString(), "This is\n\na non\\-empty\n\n\\.docx file\n\n");
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
            assert.strictEqual(file.contents.toString().includes("TEXT TEST"), true);
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
            assert.strictEqual(contents.includes("1. Roman list item 1"), true, "Error on assertion 1");
            assert.strictEqual(contents.includes("__*Donec ut nulla ligula*__"), true, "Error on assertion 2");
            assert.strictEqual(contents.includes("* Donec pellentesque*"), true, "Error on assertion 3");
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
