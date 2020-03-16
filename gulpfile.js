const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const fileinclude = require('gulp-file-include');

gulp.task('html', function(callback) {
    return gulp.src('./src/html/*.html')
        .pipe( fileinclude({ prefix: '@@' }) )
        .pipe( gulp.dest('./build/') )
    callback();
});

gulp.task('scss', function(callback) {
    return gulp.src('./src/scss/main.scss')
        .pipe( plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Styles',
                    sound: false,
                    message: 'проебавсь ' + err.message,
                }
            })
        }))
        .pipe( sourcemaps.init() )
        .pipe( sass() )
        .pipe( autoprefixer({
            overrideBrowserslist: ['last 4 versions']
        }))
        .pipe( sourcemaps.write() )
        .pipe( gulp.dest('./build/css/') )
    callback(); 
});


gulp.task('watch', function() {
    watch('./build/*.html', gulp.parallel( browserSync.reload ));
    watch('./build/css/**/*.css', gulp.parallel( browserSync.reload ));
    watch('./src/scss/**/*.scss', function() {
        setTimeout(gulp.parallel('scss'), 500);
    });

    watch('./src/html/**/*.html', gulp.parallel('html'));
});

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
});  



gulp.task('default', gulp.series( gulp.parallel('scss', 'html'), gulp.parallel('server', 'watch') ));