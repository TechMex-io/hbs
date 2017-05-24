'use strict';

/* Needed gulp config */
import gulp from 'gulp'; 
import hb from 'gulp-hb';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import notify from 'gulp-notify';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
const reload = browserSync.reload;

/* Init task */
gulp.task('init', function () {
  return gulp.src(['scss/slides.scss'])
    .pipe(concat('custom.scss'))
    .pipe(gulp.dest('custom/'));
});

/* Handllebars */
gulp.task('hbs', () => {
  return gulp
    .src('./src/views/**/*.html')
    .pipe(hb({
      partials: './src/views/partials/**/*.hbs',
      helpers: './src/views/helpers/*.js',
      data: './src/data/**/*.{js,json}'
    }))
    .pipe(gulp.dest('./dist/'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});

gulp.task('scripts', function () {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    // 'js/vendor/jquery-1.11.1.js',
    './src/js/slides.min.js',
    './src/js/custom.js'
  ])
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});

/* Sass task */
gulp.task('sass', function () {  
  gulp.src('./src/scss/slides.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('styles.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});

gulp.task('assets', () => {
  gulp.src('./src/assets/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('./dist/assets'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});

/* Reload task */
gulp.task('bs-reload', function () {
  browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function () {
  browserSync.init(['css/*.css', 'js/*.js'], {
      /*
      I like to use a vhost, WAMP guide: https://www.kristengrote.com/blog/articles/how-to-set-up-virtual-hosts-using-wamp, XAMP guide: http://sawmac.com/xampp/virtualhosts/
      */
      // proxy: 'your_dev_site.url'
      /* For a static server you would use this: */
      
      server: {
          baseDir: './'
      }
      
  });
});

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
});


gulp.task('watch', () => {
  /* Watch scss, run the sass task on change. */
  gulp.watch(['./src/scss/*.scss', './src/scss/**/*.scss'], ['sass'])
  /* Watch app.js file, run the scripts task on change. */
  gulp.watch(['./src/js/custom.js'], ['scripts'])
  /* Watch .html files, run the bs-reload task on change. */
  gulp.watch(['./src/views/**/*'], ['hbs', 'bs-reload']);
})

/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', ['sass', 'watch', 'serve']);
