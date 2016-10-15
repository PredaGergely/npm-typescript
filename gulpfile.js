const gulp = require('gulp');
const browserify = require('browserify');
const watchify = require('watchify');
const errorify = require('errorify');
const del = require('del');
const tsify = require('tsify');
const gulpTypings = require('gulp-typings');
const source = require('vinyl-source-stream');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');
const jasmineBrowser = require('gulp-jasmine-browser');
const argv = require('yargs').argv;

function createBrowserifier(entry) {
    return browserify({
        basedir: '.',
        debug: true,
        entries: [entry],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify);
}

function bundle(browserifier, bundleName, destination) {
    // putting the plugins here, if the ---dev flag is added to the gulp command
    if (argv.dev) {
        browserifier
            .plugin(watchify)
            .plugin(errorify);
    }
    return browserifier
        .bundle()
        .pipe(source(bundleName))
        .pipe(gulp.dest(destination));
}

gulp.task('clean', () => {
    return del('./javascript/**/*')
});

gulp.task('installTypings', () => {
    return gulp.src('typings.json').pipe(gulpTypings());
});

gulp.task('tsc-browserify-src', () => {
    return bundle(
        createBrowserifier('./typescript/main.ts'),
        'bundle.js',
        'javascript');
});

gulp.task('tsc-browserify-test', () => {
    return bundle(
        createBrowserifier('./typescript/test/test.ts'),
        'testbundle.js',
        'javascript/test');
});

gulp.task('run-jasmine', () => {
    gulp.src(['', 'javascript/test/testbundle.js'])
        .pipe(watch('javascript/test/testbundle.js'))
        .pipe(jasmineBrowser.specRunner())
        .pipe(jasmineBrowser.server({ port: 8888 }));
});

gulp.task('default', (done) => {
    runSequence(['clean', 'installTypings'], 'tsc-browserify-src',
        'tsc-browserify-test', () => {
            // and here
            if (argv.dev) {
                console.log('Watching...');
                gulp.watch(['typescript/**/*.ts'], ['tsc-browserify-src',
                    'tsc-browserify-test']);
            }
            done();
        });
});