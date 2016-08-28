const gulp = require('gulp')
const clean = require('gulp-clean')
const peg = require('./gulp-peg')
const exec = require('child_process').exec;

gulp.task('default', ['build'])

gulp.task('build', ['build-parser', 'build-js'])

gulp.task('build-parser', () => {
  return gulp.src('src/**/*.pegjs')
    .pipe(peg())
    .pipe(gulp.dest('dist'))
})

gulp.task('build-js', () => {
  return gulp.src(['src/**/*.js'])
    .pipe(gulp.dest('dist'))
})

gulp.task('clean', () => {
  return gulp.src(['dist', 'node_modules'], { read: false })
    .pipe(clean())
})

