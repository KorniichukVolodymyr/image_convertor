const gulp = require('gulp');
const webp = require('gulp-webp');
const clone = require('gulp-clone');
const rename = require('gulp-rename');
const compress_images = require("compress-images");
const cloneSink = clone.sink();

gulp.task('convert', () =>
  gulp.src('./img/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}')
    .pipe(rename(function (path) {
      path.basename = path.basename.replace('@', '_');
      return path.dirname + path.basename
    }))
    .pipe(cloneSink)
    .pipe(webp())
    .pipe(cloneSink.tap())
    .pipe(gulp.dest('dist'))
);

gulp.task('min', (done) =>
 compress_images(
    "./dist/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif,webp}",
    "build/",
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "84"] } },
    { png: { engine: "pngquant", command: ["--quality=89-91", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
    function (error, completed, statistic) {
      // console.log(error)
      // console.log(completed)
      // console.log(statistic)
    },
    done()
  )
);

gulp.task('default', gulp.series('convert', 'min'))
