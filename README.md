# Gulp-mammoth

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Build Status](https://travis-ci.org/lgcavalheiro/gulp-mammoth.svg?branch=main)](https://travis-ci.org/lgcavalheiro/gulp-mammoth) [![Coverage Status](https://coveralls.io/repos/github/lgcavalheiro/gulp-mammoth/badge.svg?branch=main&service=github)](https://coveralls.io/github/lgcavalheiro/gulp-mammoth?branch=main)

### Gulp plugin that converts Word documents to html or markdown files using [mammoth.js](https://github.com/mwilliamson/mammoth.js)

---

## Basic usage

```javascript
const gulp = require("gulp");
const series = gulp.series;

const mammoth = require("../src/index");

function basicUsage() {
    return gulp.src("./data/nonEmpty.docx").pipe(mammoth("html")).pipe(gulp.dest("./results"));
}

module.exports.default = series(basicUsage);
```

## Usage example with gulp-if

```javascript
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
```

All usage examples can be found on `example` folder and can be executed with `yarn gulp --gulpfile ./example/name_of_file.gulpfile.js`

## Running tests

You can use `yarn test` to run the test suite once, or you can run `yarn gulp` inside the root of the project to activate continuous TDD (it will run the tests every time a file is updated).