const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const purgecss = require("gulp-purgecss");
const browserSync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin");

// File paths
const files = {
  scssPath: "src/scss/**/*.scss",
  jsPath: "src/js/**/*.js",
  htmlPath: "src/*.html",
  htmlPartialPath: "src/partials/*.html",
  assetPath: "src/assets/**",
};

// Sass Task
function scssTask() {
  return src(files.scssPath, { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("dist/css", { sourcemaps: "." }))
    .pipe(browserSync.stream());
}

// JavaScript Task
function jsTask() {
  return (
    src(files.jsPath, { sourcemaps: true })
      .pipe(concat("all.js"))
      // .pipe(uglify())
      .pipe(dest("dist/js", { sourcemaps: "." }))
  );
}

// HTML Task
function htmlTask() {
  return src(files.htmlPath)
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(dest("dist"));
}
// HTML partials Task
function htmlPartialTask() {
  return src(files.htmlPartialPath)
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(dest("dist/partials"));
}

// Copy Assets Task
function copyAssets() {
  return src(files.assetPath, { encoding: false }).pipe(dest("dist/assets"));
}

// PurgeCSS Task
function purgeTask() {
  return src("dist/css/main.css")
    .pipe(
      purgecss({
        content: ["dist/**/*.html", "dist/**/*.js"],
        safelist: {
          standard: [/show/, /active/, /hidden/, /open/, /close/],
        },
      })
    )
    .pipe(dest("dist/css"));
}

// BrowserSync Task
function browserSyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
    notify: false,
  });
  cb();
}
function browserSyncReload(cb) {
  browserSync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch([files.scssPath], series(scssTask, purgeTask));
  watch([files.jsPath], series(jsTask, browserSyncReload));
  watch([files.htmlPath], series(htmlTask, browserSyncReload));
  watch([files.htmlPartialPath], series(htmlPartialTask, browserSyncReload));
  watch([files.assetPath], series(copyAssets, browserSyncReload));
}

// Default Task
exports.default = series(
  parallel(scssTask, jsTask, htmlTask, htmlPartialTask, copyAssets),
  purgeTask,
  browserSyncServe,
  watchTask
);

// Build Task
exports.build = series(
  parallel(scssTask, jsTask, htmlTask, htmlPartialTask, copyAssets),
  purgeTask
);
