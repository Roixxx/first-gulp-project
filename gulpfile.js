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
    return gulp.src('./app/html/.html')
        .pipe( plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'HTML include',
                    sound: false,
                    message: 'проебавсь ' + err.message,
                }
            })
        }))
        
    callback();
});

gulp.task('scss', function(callback) {
    return gulp.src('./app/scss/main.scss')
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
        .pipe( gulp.dest('./app/css/') )
    callback(); 
});


gulp.task('watch', function() {
    watch('./app/*.html', gulp.parallel( browserSync.reload ));
    watch('./app/css/**/*.css', gulp.parallel( browserSync.reload ));

    watch('./app/scss/**/*.scss', function() {
        setTimeout(gulp.parallel('scss'), 500);
    });
});

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./app/"
        }
    });
});  



gulp.task('default', gulp.parallel('server', 'watch', 'scss'));