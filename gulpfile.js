"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minifycss = require("gulp-csso");
var rename = require("gulp-rename");
var minifyjs = require("gulp-uglify");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var del = require("del");
var htmlmin = require('gulp-htmlmin');
var run = require('run-sequence');

/*Сбор и минимизация стилей*/
gulp.task("style", function () {
  gulp.src("source/less/style.less")
  .pipe(plumber())
  .pipe(less())
  .pipe(postcss([
    autoprefixer()
  ]))
  .pipe(gulp.dest("build/css"))
  .pipe(minifycss())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("build/css"));
});

/*Минимизация js*/
gulp.task('js', function () {
    gulp.src(['source/js/*.js', '!source/js/*.min.js'])
        .pipe(plumber())
        .pipe(minifyjs())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/js'));
});

/*Сжатие изображений*/
gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
             .pipe(imagemin([
               imagemin.optipng({optimizationLevel: 3}),
               imagemin.jpegtran({progressive: true}),
               imagemin.svgo()
             ]))
             .pipe(gulp.dest("source/img"));
});

/*WebP*/
gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
             .pipe(webp({quality: 90}))
             .pipe(gulp.dest("source/img"));
});

/*SVG Sprite*/
gulp.task("sprite", function () {
  return gulp.src(["source/img/logo-htmlacademy.svg",
      "source/img/left-arrow.svg",
      "source/img/right-arrow.svg",
      "source/img/icon-editor-crop.svg",
      "source/img/icon-editor-fill.svg",
      "source/img/icon-editor-contrast.svg",
      "source/img/icon-menu-burger.svg",
      "source/img/icon-menu-cross.svg"])
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

/*PostHtml*/
gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
});

/*Copy*/
gulp.task("copy", function () {
  return gulp.src([
            "source/fonts/**/*.{woff,woff2}",
            "source/img/**",
            "source/js/**"
             ], {
             base: "source"
             })
    .pipe(gulp.dest("build"));
});

/*Clean*/
gulp.task("clean", function () {
  return del("build");
});

/*Build*/
gulp.task("build", function (done) {
  run(
    "clean",
    "copy",
    "style",
    "js",
    "sprite",
    "html",
    done
  );
});

/*Watch*/
gulp.task("serve", function() {
  server.init({
    server: "build/"
  });

  gulp.watch("source/less/**/*.less", ["style"]);
  gulp.watch("source/*.html", ["html"]);
});
