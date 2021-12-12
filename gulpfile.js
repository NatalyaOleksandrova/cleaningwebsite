let project_folder= require("path").basename(__dirname);
let source_folder="#src";
let data = require('gulp-data');
let fs = require('fs');
let path={
  build:{
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
    webfonts: project_folder + "/webfonts/",
   
  },
  src:{
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/scss/style.scss",
    js: [source_folder + "/js/main.js", source_folder + "/js/libs.js"],
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: source_folder + "/fonts/*.ttf",
    webfonts: source_folder + "/webfonts/*.{ttf,eot,svg,woff,woff2,webp}",
   
  },
  watch:{
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.{jpeg,png,svg,gif,ico,webp}", 
  },
  clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
gulp = require ('gulp'),
browsersync = require ("browser-sync").create(),
fileinclude = require ("gulp-file-include"),
del = require ("del"),
scss = require ("gulp-sass");
autoprefixer = require ("gulp-autoprefixer"),
group_media = require ("gulp-group-css-media-queries"),
clean_css = require ("gulp-clean-css"),
rename = require ("gulp-rename"),
uglify = require ("gulp-uglify-es").default,
imagemin = require ("gulp-imagemin"),
webp = require ('gulp-webp'),
webphtml = require ('gulp-webp-html'),
webpcss = require ("gulp-webpcss"),
svgSprite = require ('gulp-svg-sprite'),
ttf2woff = require ('gulp-ttf2woff'),
ttf2woff2 = require ('gulp-ttf2woff2'),
fonter = require ('gulp-fonter'),
sassGlob = require('gulp-sass-glob'),
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
config = require('config');


function browserSync(params){
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/"
    },
    port:3000,
    notify: false
  })
}

function html(){
  return src(path.src.html)
  .pipe(fileinclude())
  .pipe(webphtml())
  .pipe(dest(path.build.html))
  .pipe(browsersync.stream())
}


function css() {
  return src(path.src.css)
  .pipe(
    scss({
      outputStyle: "expanded"
    })
  )
  .pipe(
    group_media()
  )
  .pipe(
    autoprefixer({
      overrideBrowserslist: ["last 5 versions"],
      cascade: true
    })
  )
  .pipe(webpcss())
  .pipe(dest(path.build.css))
  .pipe(clean_css())
  .pipe(
    rename({
      extname:".min.css"
    })
  )
  .pipe(dest(path.build.css))
  .pipe(browsersync.stream())
}

function js(){
  return src(path.src.js)
  .pipe(fileinclude())
  .pipe(dest(path.build.js))
  .pipe(
    uglify()
  )
  .pipe(
    rename({
      extname: ".min.js"
    })
  )
    .pipe(dest(path.build.js))
  .pipe(browsersync.stream())
}

function images() {
  return src(path.src.img)
  .pipe(
    webp({
      quality: 70
    })
  )
  .pipe(dest(path.build.img))
  .pipe(src(path.src.img))
  .pipe(
    imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      interlaced: true,
      optimizationLevel: 3 // 0 to 7
    })
  )
  .pipe(dest(path.build.img))
  .pipe(browsersync.stream())
}

function fonts(params){
  src(path.src.fonts)
  .pipe(ttf2woff())
  .pipe(dest(path.build.fonts));
  return src(path.src.fonts)
  .pipe(ttf2woff2())
  .pipe(dest(path.build.fonts));
};
function webfonts(params){
  src(path.src.webfonts)
  .pipe(dest(path.build.webfonts));
};


gulp.task('styles', function () {
    return gulp
        .src('#src/scss/style.scss')
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(gulp.dest('cleaningsite/styles'));
});

gulp.task('scss', function(){
  return gulp.src('#src/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
      browsers: ['last 8 versions']
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('#src/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('css', function(){
  return gulp.src([
    'node_modules/normalize.css/normalize.css',
    'node_modules/slick-carousel/slick/slick.css',
  ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('#src/scss'))
    .pipe(browserSync.reload({stream: true}))
});
gulp.task('js', function(){
  return gulp.src([
    'node_modules/slick-carousel/slick/slick.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('#src/js'))
    .pipe(browserSync.reload({stream: true}))
});
gulp.task('otf2ttf', function(){
  return src([source_folder + '/fonts/*.otf'])
  .pipe(fonter({
    formats: ['ttf']
  }))
  .pipe(dest(source_folder + '/fonts/'));
})

gulp.task('svgSprite', function(){
  return gulp.src([source_folder + '/iconsprite/*.svg'])
  .pipe(svgSprite({
    mode: {
      stack: {
        sprite: "../icons/icons.svg",
        example: true
      }
    },
  }
))
.pipe(dest(path.build.img))
})



function fontsStyle(params) {

let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
if (file_content == '') {
fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
return fs.readdir(path.build.fonts, function (err, items) {
if (items) {
let c_fontname;
for (var i = 0; i < items.length; i++) {
let fontname = items[i].split('.');
fontname = fontname[0];
if (c_fontname != fontname) {
fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
}
c_fontname = fontname;
}
}
})
}
}


function cb() { }
function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

function clean(params) {
  return del(path.clean);
}
let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts, webfonts),fontsStyle,fileinclude);
let watch = gulp.parallel(build, watchFiles,  browserSync);


exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.webfonts = webfonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;

exports.config = config;
exports.build = build;
exports.watch = watch;
exports.default = watch;
