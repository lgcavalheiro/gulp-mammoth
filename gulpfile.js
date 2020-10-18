//to be heavily modified for continuous tdd

const gulp = require('gulp');
const series = gulp.series;
const parallel = gulp.parallel;
const { mammoth } = require('./src/index');

var options = {
    styleMap: [
        "p[style-name='Section Title'] => h1:fresh",
        "p[style-name='Subsection Title'] => h2:fresh",
        "b => em",
        "comment-reference => sup"
    ]
};

async function testHtml() {
    gulp.src('./input/*.docx')
        .pipe(mammoth.docxToHtml(options))
        .pipe(gulp.dest('./outHtml'))
}

async function testMarkdown() {
    gulp.src('./input/*.docx')
        .pipe(mammoth.docxToMarkdown(options))
        .pipe(gulp.dest('./outMd'))
}

module.exports.default = parallel(testHtml, testMarkdown)
