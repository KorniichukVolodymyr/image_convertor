import compress_images from "compress-images";

compress_images(
  "./img/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}", "dist/",
  { compress_force: false, statistic: true, autoupdate: true },
  false,
  { jpg: { engine: "mozjpeg", command: ["-quality", "84"] } },
  { png: { engine: "pngquant", command: ["--quality=89-91", "-o"] } },
  { svg: { engine: "svgo", command: "--multipass" } },
  { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
  function (error, completed, statistic) {
    // console.log(error);
    // console.log(completed);
    // console.log(statistic);
  }
);
