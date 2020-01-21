const {parallel,watch,src,dest} = require('gulp'),
      browserSync = require('browser-sync').create(),
      minify = require('gulp-minify'),
      cleanCSS = require('gulp-clean-css'),
      sourcemaps = require('gulp-sourcemaps'),
      autoprefixer = require('gulp-autoprefixer'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      plumber = require('gulp-plumber'),
      notify = require('gulp-notify'),
      pug = require('gulp-pug'),
      imagemin = require('gulp-imagemin'),
      imgCompress = require('imagemin-jpeg-recompress');

function bs(){
  cssTasks();
  pugFunc();
  minifyJS(),
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  watch("./dist/**/*.html").on('change', browserSync.reload);
  watch("./src/sass/**/*.sass", cssTasks);
  watch("./src/sass/**/*.scss", cssTasks);
  watch("./src/pug/**/*.pug", pugFunc);
  watch("./src/js/**/*.js", minifyJS);
  watch("./src/js/**/*.js").on('change', browserSync.reload);
}

function cssTasks() {
  return src("./src/sass/*.sass", "./src/sass/*.scss")
    .pipe( plumber({
      errorHandler: notify.onError(function(err){
        return {
          title: 'Styles',
          sound: false,
          message: err.message
        };
      })
    }))
    // .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(rename({
        suffix: '.min',
        prefix: ''
      }))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(autoprefixer({
        cascade: false
      }))
    // .pipe(sourcemaps.write())
    .pipe(dest('./dist/css'))
    .pipe(browserSync.stream());
}

function pugFunc(){
  return src('./src/pug/**/*.pug')
    .pipe( plumber({
      errorHandler: notify.onError(function(err){
        return {
          title: 'Pug',
          sound: false,
          message: err.message
        }
      })
    }))
    .pipe(sourcemaps.init())
    .pipe(pug())
    .pipe(sourcemaps.write())
    .pipe(dest('./dist'));
}

function minifyJS(){
  src(['./src/js/**/*.js', '!./src/js/**/*.min.*'])
    .pipe(sourcemaps.init())
    .pipe(minify({
      ext:{
        src:'-debug.js',
        min:'.js'
      }}
    ))
    .pipe(sourcemaps.write())
    .pipe(dest('./dist/js'))
  }

  function imgmin() {
    return src('./src/img/**/*')
    .pipe(imagemin([
      imgCompress({
        loops: 4,
        min: 70,
        max: 80,
        quality: 'high'
      }),
      imagemin.gifsicle(),
      imagemin.optipng(),
      imagemin.svgo()
    ]))
    .pipe(dest('./dist/img'));
  }


exports.serve = bs;
exports.build = parallel(imgmin);