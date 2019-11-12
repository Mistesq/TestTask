"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var rename = require("gulp-rename");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var del = require('del');

gulp.task('style', function () {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream())
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest('build/css'));
});



gulp.task('serve', function() {
   server.init({
      server: "build/",
      notify: false,
      open: true,
      cors: true,
      ui: false
    });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("style"));
});

gulp.task("images", function () {
  return gulp.src("source/img/*")
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("source/img"));
});


gulp.task("copy", function() {
  return gulp.src([
    "source/fonts/*.{woff,woff2}",
    "source/img/*",
    "source/js/*.js"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});


gulp.task("build", gulp.series("clean", "copy", "style"));
gulp.task("start", gulp.series("build", "serve"));
