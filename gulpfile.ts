/// <reference path="./typings/gulp-clean/index.d.ts" />


import path = require('path');
import gulp = require('gulp');
import ts = require('gulp-typescript');
import sourcemaps = require('gulp-sourcemaps'); 
import clean = require('gulp-clean');



gulp.task('fix', (doneCB: Function) => {
    return gulp.src(['./node_modules/gulp-typescript/release/**/*.ts'])
});


let tsOptions = {
    typescript: require('typescript') 
}
let sourceMapOptions: sourcemaps.WriteOptions = {
    includeContent: true,
    sourceRoot: './'
}

let tsProject: any = ts.createProject(path.join(process.cwd(), 'tsconfig.json'));
console.log(path.join(process.cwd(), 'tsconfig.json'));
/*
 * Empty task that does nothing but make sure the other tasks build.
 * Useful when you want to rebuild the css, js, and html with one click without restarting the site.
 */
gulp.task('build', (doneCB: Function) => {
    let result = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());
    return result.js
        .pipe(sourcemaps.write('./', sourceMapOptions))
        .pipe(gulp.dest('./bin'));

    // gulp.src(['./src/**/*.ts'])
    //     .pipe(tsc({ project: 'tsconfig.json' }))
    //     .pipe(gulp.dest('./bin/'));
    // var when = p.When([env.RenderLess(), env.RenderTS(), env.RenderHTML(), env.RenderWebWorkers()]);
    // when.then(() => {
    //     doneCB();
    // });
});

gulp.task('clean', (doneCB: Function) => {
    return gulp.src(['./bin/', './gulpfile.js'], { read: false }).pipe(clean({ force: true }));
});


gulp.task('default', ['build']);
