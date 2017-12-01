'use strict';
var gulp = require('gulp');
var bump = require('gulp-bump');
const PATH = {
    package: './package.json'
};
gulp.task('bump', function () {
    gulp.src(PATH.package)
        .pipe(bump({type: 'patch'}))
        .pipe(gulp.dest('./'));
});