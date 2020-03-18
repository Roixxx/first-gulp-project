const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const del = require('del');

gulp.task('pug', function() {
    return gulp.src('./src/pug/pages/**/*.pug')
        .pipe( plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Pug',
                    sound: false,
                    message: 'Error ' + err.message,
                }
            })
        }))
        .pipe( pug({
            pretty: true
        }) )
        .pipe(gulp.dest('./build/'))
        .pipe( browserSync.stream() )
});

gulp.task('scss', function(callback) {
    return gulp.src('./src/scss/main.scss')
        .pipe( plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Styles',
                    sound: false,
                    message: 'Error ' + err.message,
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
        .pipe( browserSync.stream() )
    callback(); 
});


gulp.task('copy:img', function(callback) {
    return gulp.src('./src/images/**/*.*')
        .pipe(gulp.dest('./build/images'))
    callback();
});

gulp.task('copy:upload', function(callback) {
    return gulp.src('./src/upload/**/*.*')
        .pipe(gulp.dest('./build/upload/'))
    callback();
});

gulp.task('copy:js', function(callback) {
    return gulp.src('./src/js/**/*.*')
        .pipe(gulp.dest('./build/js/'))
    callback();
});

gulp.task('watch', function() {
    watch('/build/js/**/*.*', gulp.parallel(browserSync.reload));
    watch('/build/images/**/*.*', gulp.parallel(browserSync.reload));

    watch('./src/scss/**/*.scss', function() {
        setTimeout(gulp.parallel('scss'), 500);
    });
    watch('./src/pug/**/*.pug', gulp.parallel('pug'))


    watch('./src/images/**/*.*', gulp.parallel('copy:img'));
    watch('./src/upload/**/*.*', gulp.parallel('copy:upload'));
    watch('./src/js/**/*.*', gulp.parallel('copy:js'));
});


gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./build/"
        },
        open: false
    });
});  

gulp.task('clean:build', function() {
    return del('./build');
});

gulp.task( 'default', 
    gulp.series( 
        gulp.parallel('clean:build'),
        gulp.parallel('copy:img', 'copy:upload', 'copy:js'), 
        gulp.parallel('pug' ,'scss'), 
        gulp.parallel('server', 'watch') 
    ));