/**
 * Gulpfile para el proyecto de rediseño
 * Compilación de SASS/SCSS a CSS comprimido
 * Servidor local con recarga automática
 */

// Importación de dependencias
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const fs = require('fs');
const path = require('path');

// Rutas
const paths = {
  scss: {
    src: './sass/**/*.{sass,scss}',
    dest: './css/'
  },
  html: {
    src: './**/*.html'
  },
  js: {
    src: './**/*.js',
    exclude: './gulpfile.js'
  }
};

// Función para manejar errores
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// Función para limpiar manualmente los archivos CSS
function cleanCssFiles(done) {
  // Asegurar que existe la carpeta css
  if (!fs.existsSync('./css')) {
    fs.mkdirSync('./css', { recursive: true });
    done();
    return;
  }
  
  // Leer todos los archivos en la carpeta css
  const files = fs.readdirSync('./css');
  
  // Eliminar cada archivo
  files.forEach(file => {
    const filePath = path.join('./css', file);
    if (fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  });
  
  done();
}

// Tarea para compilar SASS/SCSS sin minimizar
function compileSass() {
  return gulp.src(paths.scss.src)
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

// Tarea para minimizar CSS
function minifyCss() {
  return gulp.src('./css/style.css')
    .pipe(cleanCSS())
    .pipe(rename({
      basename: 'style',
      suffix: '.min',
      extname: '.css'
    }))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

// Tarea para iniciar el servidor local
function serve() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    port: 3000,
    open: true,
    notify: false
  });
}

// Tarea para recargar el navegador manualmente
function reload(done) {
  browserSync.reload();
  done();
}

// Tarea para vigilar cambios
function watchFiles() {
  // Observar archivos SASS/SCSS y compilar
  gulp.watch(paths.scss.src, gulp.series(cleanCssFiles, compileSass, minifyCss));
  
  // Observar HTML y recargar
  gulp.watch(paths.html.src, reload);
  
  // Observar JS excepto gulpfile.js y recargar
  gulp.watch([paths.js.src, '!' + paths.js.exclude], reload);
}

// Definición de tareas
const watch = gulp.parallel(watchFiles, serve);
const build = gulp.series(cleanCssFiles, compileSass, minifyCss);

// Exportación de tareas
exports.sass = compileSass;
exports.build = build;
exports.default = gulp.series(build, watch);
