const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const browsersync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const fileinclude = require('gulp-file-include');

// Sass Task
function scssTask() {
    return src('app/scss/style.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version']
        }))
        .pipe(dest('app/css'));
}


//Html Task
function htmlTask() {
    return src('app/index.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@root',
        }
        ))
        .on('error', function () { notify('HTML include error'); })
        .pipe(dest('dest/'));
}
// Browsersync Tasks
function browsersyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: 'app'
        }
    });
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

// Watch Task
function watchTask() {
    watch('app/*.html', browsersyncReload);
    watch(['app/scss/**/*.scss'], series(scssTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
    htmlTask,
    scssTask,
    browsersyncServe,
    watchTask
);