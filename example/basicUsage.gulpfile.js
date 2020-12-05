const gulp = require("gulp");
const series = gulp.series;

const mammoth = require("../src/index");

function basicUsage() {
    return gulp.src("./data/nonEmpty.docx").pipe(mammoth("html")).pipe(gulp.dest("./results"));
}

module.exports.default = series(basicUsage);
