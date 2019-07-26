const { series, parallel, src, dest, watch, task } = require('gulp');
const ts = require('gulp-typescript');
const rimraf = require('rimraf');
const nodemon = require('gulp-nodemon');
const tool = require('./tool').init();

const tsProject = ts.createProject('tsconfig.json');
const tsLibProject = ts.createProject('lib-tsconfig.json');

function clean(cb) {
    rimraf('testDist', cb);
}

function tsLibCompile() {
    return tsLibProject.src().pipe(tsLibProject()).pipe(dest('dist'));
}

function cleanTsController(cb){
    rimraf('testDist/controller', cb);
}
function cleanTsModel(cb){
    rimraf('testDist/model', cb);
}
function cleanTemplate(cb){
    rimraf('testDist/view', cb);
}

function tsCompile() {
    return tsProject.src().pipe(tsProject()).pipe(dest('testDist'));
}

function cpTemplate() {
    return src('test/view/**/*').pipe(dest('testDist/view'));
}

function connectServer(done) {
    nodemon({
        script: 'testDist/server.js',
        delay: 1500,
        ext: 'js html',
        watch: ['testDist'],
        env: { 'NODE_ENV': 'development' },
        done,
    });
}

const build = parallel(cpTemplate, series(tsLibCompile,tsCompile));

exports.clean = task(clean);
exports.build = series(clean, build);

exports.default = function () {
    
    // koa-springboot will scan controller directory
    // so we need to make sure dist/controller has no other files should be deleted
    watch('test/controller/*.ts', { events: 'unlink' }, cleanTsController);
    watch('test/model/*.ts', { events: 'unlink' }, cleanTsModel);
    watch(['test/**/*.ts'], tsCompile);
    watch(['lib/**/*.ts'], tsLibCompile);
    watch(['test/view/**/*'], series(cleanTemplate, cpTemplate));
    series(build, connectServer)();
};
