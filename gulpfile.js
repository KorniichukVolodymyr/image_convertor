import gulp from 'gulp';
import webp from 'gulp-webp';
import clone from 'gulp-clone';
import rename from 'gulp-rename';
import run from 'gulp-run';

const cloneSink = clone.sink();

gulp.task('convert', () =>
  gulp.src('./dist/**/*.{jpg,JPG,jpeg,JPEG,png,svg}')
    .pipe(rename(function (path) {
      path.basename = path.basename.replace('@', '_');
      return path.dirname + path.basename
    }))
    .pipe(cloneSink)
    .pipe(webp())
    .pipe(cloneSink.tap())
    .pipe(gulp.dest('build'))
);

gulp.task('min', function () {
  return gulp.src('./compressImage.js',)
    .pipe(run('npm run compress-images'))
});

gulp.task('default', gulp.series('min', 'convert'))
