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
import frontMatter from 'gulp-front-matter';
import plumber from 'gulp-plumber';
import fs from 'fs';
import browserSync from 'browser-sync';
const reload = browserSync.reload;
import rsync from 'rsyncwrapper';
import gutil from 'gulp-util';
import ghPages from 'gulp-gh-pages';
import VinylFtp from 'vinyl-ftp';
import surge from 'surge';
import {config} from 'dotenv';
config();

/* Init task */
gulp.task('build', ['sass', 'hbs', 'scripts', 'assets']);


/* Handllebars */
gulp.task('hbs', () => {
  return gulp
    .src('./src/views/**/*.html')
    .pipe(plumber())
    .pipe(frontMatter({
            property: 'page'
        }))
    .pipe(
      hb({
        partials: './src/views/partials/**/*.hbs',
        helpers: './src/views/helpers/*.js',
        data: './src/data/**/*.{js,json}'
      })
      .data({
        baseurl: '/'
      })
  )
    .pipe(gulp.dest('./dist/'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});

gulp.task('scripts', () => {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    // 'js/vendor/jquery-1.11.1.js',
    './src/js/slides.min.js',
    './src/js/custom.js'
  ])
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});

/* Sass task */
gulp.task('sass', () => {
  return gulp.src('./src/scss/slides.scss')
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
  return gulp.src('./src/assets/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('./dist/assets'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});


const fileContent = '{{> head}}\n\n{{> svg-lib}}\n\n  <!--all content here  -->\n\n{{> footer }}';
/* Create directory with index file */
gulp.task('dir', () => {
  let dir = process.argv[3].replace(/^-+/, "");
  fs.mkdirSync(`./src/views/${dir}`);
  fs.writeFileSync(`./src/views/${dir}/index.html`, fileContent);
});

/* Create file */
gulp.task('page', () => {
  let path = process.argv[3].replace(/^-+/, "");
  let file = path.substr(path.lastIndexOf('/') + 1) + '.html'; // find word after last / and append .html
  let dir = path.replace(file, '');
  fs.writeFileSync(`./src/views/${dir}${file}`, fileContent);
});

/* Reload task */
gulp.task('bs-reload', () => {
  browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', () => {
  browserSync.init(['css/*.css', 'js/*.js'], {
    server: {
      baseDir: './'
    }      
  });
});

gulp.task('serve', () => {
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
  /* Watch assets files, run the assets task on change. */
  gulp.watch(['./src/assets/**/*'], ['assets'])
  /* Watch .html files, run the bs-reload task on change. */
  gulp.watch(['./src/views/**/*'], ['hbs', 'bs-reload']);
})

/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', ['build', 'watch', 'serve']);



// Deployment tasks
gulp.task('deploy', () => {
  return deploySite(process.argv[3]);
});

const deploySite = (deploymentEnv) => {
  if (deploymentEnv === '--prod') {
    return rsync({
      ssh: true,
      src: './dist/',
      dest: process.env.SSH,
      recursive: true,
      syncDest: true,
      args: ['--verbose']
    },
    (erro, stdout, stderr, cmd) => {
        gutil.log(stdout);
    });
  }

  if (deploymentEnv === '--dev') {
    return gulp.src('./dist/**/*')
      .pipe(ghPages());
  }

  if (deploymentEnv === '--ftp') {
    const conn = VinylFtp.create({
      host: process.env.HOST,
      user: process.env.USERNAME,
      password: process.env.PASS,
      parallel: 10,
      log: gutil.log
    });
    const globs = [
      './dist/**/*'
    ];
    return gulp.src(globs, {base: './dist', buffer: false})
      .pipe(conn.newer('/'))
      .pipe(conn.dest('/'));
  }

  if (deploymentEnv === '--surge') {
    console.log(deploymentEnv)
    return surge({
      project: './dist',         // Path to your static build directory
      domain: 'detailed-stage.surge.sh'  // Your domain or Surge subdomain
    });
  }
}



gulp.task('surg', function () {
  console.log(surge)
  return surge({
    project: './disto',         // Path to your static build directory
    domain: 'detailed-stage.surge.sh'  // Your domain or Surge subdomain
  });
})
