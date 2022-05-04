import gulp from "gulp";
import clone from "gulp-clone";
import rename from "gulp-rename";
import compress_images from "compress-images";
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";

const cloneSink = clone.sink();

gulp.task("rename", () =>
  gulp.src("./img/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif,webp}")
    .pipe(rename(function (path) {
      path.basename = path.basename
        .replace(/-\d/g, "")
        .replace("@0.25x", "_mob")
        .replace("@0.5x", "_mob_2x")
        .replace("@0.75x", "_tab")
        .replace("@1.25x", "_tab_2x")
        .replace("@1x", "_desk")
        .replace("@2x", "_desk_2x");
      return path.dirname + path.basename;
    }))
    .pipe(gulp.dest("dist"))
);

gulp.task("min", (done) =>
  compress_images(
    "./dist/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}",
    "compress/",
    {compress_force: false, statistic: false, autoupdate: false},
    false,
    {jpg: {engine: "mozjpeg", command: ["-quality", "80"]}},
    {png: {engine: "pngquant", command: ["--quality=88-90", "-o"]}},
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

gulp.task("copy", () =>
  gulp.src("./dist/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif,webp}")
    .pipe(cloneSink)
    .pipe(cloneSink.tap())
    .pipe(gulp.dest("build"))
);

gulp.task("convert-jpg", () =>
  imagemin(
    ["./dist/**/*.{jpg,JPG,jpeg,JPEG}"],
    {
      destination: "build/",
      plugins: [
        imageminWebp(
          {
            quality: 85,
            alphaQuality: 100,
            method: 6,
            sns: 100,
            filter: 100,
            autoFilter: true,
            sharpness: 7,
            // lossless: true,
            // nearLossless: 100,
            metadata: "exif"
          }
        )
      ]
    }
  )
);

gulp.task("convert-png", () =>
  imagemin(
    ["./dist/**/*.{png,PNG}"],
    {
      destination: "build/",
      plugins: [
        imageminWebp(
          {
            quality: 100,
            alphaQuality: 100,
            method: 6,
            sns: 100,
            filter: 100,
            autoFilter: true,
            sharpness: 7,
            lossless: true,
            nearLossless: 100,
            metadata: "exif"
          }
        )
      ]
    }
  )
);

gulp.task("default",
  gulp.series("rename", "copy",
    gulp.parallel("convert-jpg", "convert-png")
  )
);
