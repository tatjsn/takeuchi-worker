import gulp from 'gulp';
import webpack from 'webpack-stream';
import browserSync from 'browser-sync';

const plugins = [
  new webpack.webpack.DefinePlugin({
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
    'process.env.FIREBASE_URL': `"${process.env.FIREBASE_URL}"`
  }),
];
if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );
}

gulp.task('js', () =>
  gulp.src('src/client/js/entry.js')
  .pipe(webpack({
    module: {
      loaders: [
        { test : /\.js$/, exclude: /node_modules/, loader: 'babel' }
      ]
    },
    output: {
      filename: 'bundle.js'
    },
    plugins
  }))
  .pipe(gulp.dest('dist')));

gulp.task('html', () =>
  gulp.src('src/client/html/*.html')
  .pipe(gulp.dest('dist')));

gulp.task('js-watch', ['js'], browserSync.reload);
gulp.task('html-watch', ['html'], browserSync.reload);

gulp.task('dist', ['js', 'html']);

gulp.task('serve', ['dist'], () => {
  gulp.watch(['src/client/**/*.js', '!**/.*'], ['js-watch']);
  gulp.watch(['src/client/**/*.html', '!**/.*'], ['html-watch']);

  browserSync({
    server: { baseDir: 'dist' },
    notify: false
  });
});

gulp.task('default', ['serve']);
