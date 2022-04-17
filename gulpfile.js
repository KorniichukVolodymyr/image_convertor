import gulp from "gulp";
import clone from "gulp-clone";
import rename from "gulp-rename";
import compress_images from "compress-images";
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";

const cloneSink = clone.sink();

gulp.task("rename", () =>
  gulp.src("./img/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}")
    .pipe(rename(function (path) {
      path.basename = path.basename.replace("@", "_");
      return path.dirname + path.basename;
    }))
    .pipe(cloneSink)
    .pipe(cloneSink.tap())
    .pipe(gulp.dest("dist"))
);

gulp.task("convert", () =>
    imagemin(
      ["./dist/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}"],
      {
        destination: "build/",
        plugins: [
          imageminWebp(
            {
              quality: 80,
              alphaQuality: 100,
              method: 6,
              sharpness: 7,
              nearLossless: 100,
              metadata: 'exif'
            })
        ]
      }
    )
);

gulp.task("min", (done) =>
  compress_images(
    "./dist/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif,webp}",
    "build/",
    {compress_force: false, statistic: true, autoupdate: true},
    false,
    {jpg: {engine: "mozjpeg", command: ["-quality", "84"]}},
    {png: {engine: "pngquant", command: ["--quality=89-91", "-o"]}},
    {svg: {engine: "svgo", command: "--multipass"}},
    {gif: {engine: "gifsicle", command: ["--colors", "64", "--use-col=web"]}},
    function (error, completed, statistic) {
      // console.log(error);
      // console.log(completed);
      // console.log(statistic);
    },
    done()
  )
);

gulp.task("default", gulp.series("rename", "convert", "min"))
