'use strict';

var pkg = require('./package');
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var zip = require('gulp-zip');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var bump = require('gulp-bump');

var paths = {
  root: './',
  src: './' + pkg.name + '.js',
  dist: './dist',
  release: './release',
  releaseFiles: ['./README.md', './LICENSE.txt', './bower.json', './dist/*'],
  releaseZip: pkg.name + '-' + pkg.version + '.zip',
  releaseTar: pkg.name + '-' + pkg.version + '.tar',
  versions: ['./bower.json', './package.json']
};

gulp.task('bump', function() {
  gulp.src(paths.versions)
    .pipe(bump())
    .pipe(gulp.dest(paths.root));
});

gulp.task('build', function() {
  return browserify('./browser.js')
    .bundle()
    .pipe(source(paths.src))
    .pipe(gulp.dest(paths.dist))
    .pipe(streamify(uglify()))
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('release', ['release-tar', 'release-zip']);

gulp.task('release-tar', ['build'], function() {
  return gulp.src(paths.releaseFiles)
    .pipe(tar(paths.releaseTar))
    .pipe(gzip())
    .pipe(gulp.dest(paths.release));
});

gulp.task('release-zip', ['build'], function() {
  return gulp.src(paths.releaseFiles)
    .pipe(zip(paths.releaseZip))
    .pipe(gulp.dest(paths.release));
});
