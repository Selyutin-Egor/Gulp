// cd /d Z:\home\localhost\www\skazkivdome\project0
'use strict';

var path = {
    build: {
        js: 'build/js/',
        css_tmp: 'build/css_tmp/',
        css: 'build/css/',
        img: 'build/img/'
    },
    src: {
        js: ['src/js/m-skvd.js', 'src/js/m-awe+sound.js'],
        style: ['src/style/m-style.scss', 'src/style/m-bar-ui.scss'],
        img: 'src/img/**/*.*'
    },
    watch: {
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        css: 'src/css/**/*.css',
        img: 'src/img/**/*.*'
    },
},
subfiles = '/*.*';

var gulp = require('gulp'),
sass = require('gulp-sass'),
prefixer = require('gulp-autoprefixer'),
sourcemaps = require('gulp-sourcemaps'),
jshint = require('gulp-jshint'),
stripDebug = require('gulp-strip-debug'),
//minifyCSS = require('gulp-minify-css'),
cleanCSS = require('gulp-clean-css'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
cache = require('gulp-cache'),
imagemin = require('gulp-imagemin'),
clean = require('gulp-clean'),
notify = require('gulp-notify'),
plumber = require('gulp-plumber')
;

var errorHandler = {
    errorHandler: notify.onError(function (error) {
        return {
            title: 'Ошибка в плагине <%= error.plugin %>',
            message: error.message
        };
    })
};

// Здесь мы преобразовываем SASS в CSS
gulp.task('sass',function(){
   return gulp.src(path.src.style)
       .pipe(plumber(errorHandler)) //Эту строку можно вставить в каждую задачу
        .pipe(sourcemaps.init())
        .pipe(sass().on('error',sass.logError))
        .pipe(prefixer('last 2 versions', '> 10%'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.css_tmp))

        // Здесь мы минифицируем CSS для production
        .pipe(cleanCSS())
//        .pipe(minifyCSS())
        .pipe(concat('m-min.css'))
        .pipe(gulp.dest(path.build.css))
});

// Проверяем скрипты на ошибки
gulp.task('lint', function() {
//    return gulp.src(['./project0/scripts/*.js', '!./project0/scripts/*.min.js'])
    return gulp.src(path.src.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Конкатенируем скрипты, удаляя из них лишнее
gulp.task('scripts', function() {
    return gulp.src(path.src.js)
        .pipe(concat('m-min.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
});

// Минимизируем изображения, кэшируя готовые
gulp.task('images', function() {
    return gulp.src(path.src.img)
        .pipe(cache(imagemin({
            progressive: true,
        })))
        .pipe(gulp.dest(path.build.img))
});

// Очищаем каталоги для вновь формируемых файлов
gulp.task('clean', function() {
//    return gulp.src(['./project0/styles-min/*', './project0/scripts-min/*'], {read: false})
    return gulp.src([path.build.css_tmp + subfiles, path.build.css + subfiles, path.build.js + subfiles], {read: false})
        .pipe(clean());
});

// При изменении файлов запускаем соответствующие задачи. Если изменились CSS - тоже запускаем
gulp.task('watch', function() {
    gulp.watch(path.src.style, ['sass']);
    gulp.watch(path.src.js, ['scripts']);
    gulp.watch(path.src.img, ['images']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('sass', 'scripts', 'images', 'watch');
});

//gulp.task('sass:watch',function(){
//gulp.watch('./project0/**/*.scss', ['sass']);
//});