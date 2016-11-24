var gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    min = require('gulp-uglify'),
    sass = require('gulp-sass'),
    size = require('gulp-size'),
    sourcemaps = require('gulp-sourcemaps'),
    browser = require("browser-sync").create();

var paths = {
    js : './js/**/*.js',
    jsdir : './js',
    script : './scripts/**/*.js',
    scss : [
        './scss/**/*.scss',
        '!scss/**/*_scsslint_tmp*.scss'
    ],
    cssdir : './css',
    html: './**/*.html'
};

gulp.task('clean', function () {
    del.sync([
        paths.jsdir,
        paths.cssdir
    ]);
});

gulp.task('sass:dev', function () {
    return gulp.src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass({
            sourceComments: 'normal'
        }).on('error', sass.logError))
        .pipe(size({ showFiles: true }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.cssdir))
        .pipe(browser.stream());
});

gulp.task('sass:prod', function () {
    return gulp.src(paths.scss)
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest(paths.cssdir));
});

gulp.task('js:dev', function () {
    return gulp.src(paths.script)
        .pipe(sourcemaps.init())
        .pipe(size({showFiles: true}))
        .pipe(concat('build.js'))
        .pipe(sourcemaps.write())
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest(paths.jsdir));
});

gulp.task('js:prod', function () {
    return gulp.src(paths.script)
        .pipe(concat('build.js'))
        .pipe(min())
        .pipe(gulp.dest(paths.jsdir));
});

gulp.task('watch', function () {
    browser.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch(paths.scss, ['sass:dev']);
    gulp.watch(paths.script, ['js:dev']);
    gulp.watch([paths.html, paths.js]).on('change', browser.reload);
});

gulp.task('default', ['clean', 'js:dev', 'sass:dev', 'watch']);
gulp.task('prod', ['clean', 'js:prod', 'sass:prod']);

