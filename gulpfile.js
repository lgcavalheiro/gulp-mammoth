const gulp = require("gulp");
const watch = gulp.watch;
const series = gulp.series;
const mocha = require("gulp-spawn-mocha-nyc");

const watcher = watch(["src/*.js", "test/unit/*.test.js"]);
const DEBUG = process.env.NODE_ENV === "debug";

watcher.on("change", function (path, stats) {
    console.log(`File ${path} was changed - Relaunching...`);
    exports.default();
});

watcher.on("error", function (e) {
    console.error(e.stack);
});

process.on("uncaughtException", function (e) {
    console.error(e.stack);
});

function startTDD() {
    return gulp.src(["./test/unit/*.test.js"], { read: false }).pipe(
        mocha({
            debugBrk: DEBUG,
            R: "spec",
            nyc: true,
        })
    );
}

module.exports.default = series(startTDD);
