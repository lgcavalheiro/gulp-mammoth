const Vinyl = require("vinyl");
const assert = require("assert");
const path = require("path");
const fs = require("fs");

const gulpMammoth = require("../../src/index");

describe("Raw text extraction tests:", () => {
    let stream;

    beforeEach(() => {
        stream = gulpMammoth("txt");
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

    it("Should have blank contents if input file is empty", done => {
        let input = path.resolve(__dirname, "../data/empty.docx");

        stream.on("data", file => {
            assert.strictEqual(file.contents.toString(), "\n\n");
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

    it("Should extract raw text from .docx file", done => {
        let input = path.resolve(__dirname, "../data/nonEmpty.docx");

        stream.on("data", file => {
            assert.strictEqual(file.history.length, 2);
            assert.strictEqual(file.extname, ".txt");
            assert.strictEqual(file.contents.toString(), "This is\n\n\n\na non-empty\n\n\n\n.docx file\n\n");
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
});
