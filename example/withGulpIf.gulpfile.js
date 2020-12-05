const gulp = require("gulp");
const gulpIf = require("gulp-if");
const series = gulp.series;

const mammoth = require("../src/index");

function withGulpIf() {
    return gulp
        .src("./data/*")
        .pipe(gulpIf(file => file.basename.toLowerCase().includes("html"), mammoth("html")))
        .pipe(gulpIf(file => file.basename.toLowerCase().includes("markdown"), mammoth("md")))
        .pipe(gulpIf(file => file.basename.toLowerCase().includes("text"), mammoth("txt")))
        .pipe(gulp.dest("./results"));
}

module.exports.default = series(withGulpIf);
