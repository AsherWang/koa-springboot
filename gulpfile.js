const { series, parallel, src, dest, watch, task } = require('gulp');
const ts = require('gulp-typescript');
const rimraf = require('rimraf');
const nodemon = require('gulp-nodemon');

const tsProject = ts.createProject('tsconfig.json');

function clean(cb) {
    rimraf('dist', cb);
}

function tsCompile() {
    return tsProject.src().pipe(tsProject()).pipe(dest('dist'));
}

function cpTemplate() {
    return src('src/view/**/*').pipe(dest('dist/view'));
}

function connectServer(done) {
    nodemon({
        script: 'dist/server.js',
        ext: 'js html',
        watch: ['dist'],
        env: { 'NODE_ENV': 'development' },
        done,
    });
}

const build = parallel(cpTemplate, tsCompile);

exports.clean = task(clean);
exports.build = series(clean, build);

exports.default = function () {
    
    // koa-springboot will scan controller directory
    // so we need to make sure dist/controller has no other files should be deleted
    watch('src/controller/*.ts', { events: 'unlink' }, function(cb) {
        rimraf('dist/controller', cb);
    });
    watch(['src/**/*.ts', 'src/view/**/*'], build);
    series(build, connectServer)();
};
