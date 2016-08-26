const gulp = require('gulp')
const jest = require('gulp-jest')
const clean = require('gulp-clean')
const peg = require('./gulp-peg')
const exec = require('child_process').exec;

gulp.task('clean', () => {
  return gulp.src(['dist', 'node_modules'], { read: false })
    .pipe(clean())
})

gulp.task('build', () => {
  return gulp.src('src/**/*.pegjs')
    .pipe(peg())
    .pipe(gulp.dest('dist'))
})

gulp.task('default', ['build'])
