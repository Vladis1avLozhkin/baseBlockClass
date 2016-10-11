const gulp = require('gulp');
const notify = require('gulp-notify');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const vinylPaths = require('vinyl-paths');
const pug = require('gulp-pug');
const less = require('gulp-less');
const minifyCSS = require('gulp-minify-css');
const autoprefixer = require('gulp-autoprefixer');
const image = require('gulp-image');
const flatten = require('gulp-flatten');

const minimize = process.argv.indexOf('--minimize') !== -1;

gulp.task('less', function () {
	gulp.src('src/main.less')
		.pipe(sourcemaps.init())
			.pipe(less())
			.on('error', notify.onError())
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(gulpif(minimize, minifyCSS()))
			.on('error', notify.onError())
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('dist/'))
});

gulp.task('pug', function () {
    gulp.src(['src/pages/*.pug'])
		.pipe(pug({
			// не минифицировать
            pretty: true,
		}))
		.on('error', notify.onError())
		.pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    gulp.src('src/**/**/images/*.*')
        .pipe(image())
        .on('error', notify.onError())
        .pipe(flatten())
        .pipe(gulp.dest('dist/images'));

    gulp.src('src/images/*.svg')
        .pipe(gulp.dest('dist/images/'))
});

gulp.task('clean', function() {
    gulp.src('./dist/')
        .pipe(vinylPaths(del));
});

gulp.task('watch', function () {
    gulp.watch([
        'src/**/**/*.pug',
        'src/**/*.pug',
    ], ['pug']);
    gulp.watch(['src/**/*.less', 'src/**/**/*.less'], ['less']);
    gulp.watch('src/**/**/images/*.*', ['images']);
});

gulp.task('default', ['clean', 'less', 'pug', 'images', 'watch']);
