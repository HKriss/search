var gulp = require('gulp');
var sass = require('gulp-sass');
var server = require('gulp-webserver');
var url = require('url')
var fs = require('fs');
var path = require('path');
var seaJson = require('./data/data.json');
gulp.task('devSass', function() {
    return gulp.src('./src/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'))
});
gulp.task('devServer', function() {
    return gulp.src('src')
        .pipe(server({
            port: 8888,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return res.end();
                }

                if (pathname === '/api/search') {
                    var paths = url.parse(req.url, true).query.val;
                    var arr = [];
                    seaJson.title.forEach(function(item) {
                        if (item.indexOf(paths) !== -1) {
                            arr.push(item);
                        }
                    });
                    res.end(JSON.stringify({ code: 0, msg: arr }));
                } else if (pathname === '/api/searchBtn') {
                    var paths = url.parse(req.url, true).query.val;
                    var arr = [];
                    seaJson.title.forEach(function(item) {
                        if (item.indexOf(paths) !== -1) {
                            arr.push(item);
                        }
                    });
                    res.end(JSON.stringify({ code: 0, msg: arr }));
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }))
});
gulp.task('watch', function() {
    return gulp.watch('./src/sass/*.scss', gulp.series('devSass'));
});
gulp.task('dev', gulp.series('devSass', 'devServer', 'watch'));