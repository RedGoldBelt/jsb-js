import gulp from "gulp";
const {
    task,
    src,
    dest
} = gulp;
import ts from "gulp-typescript";
import umd from "gulp-umd";
import webpack from "webpack-stream";
import uglify from "gulp-uglify";

task("build", function () {
    const tsConfig = {
        noEmitOnError: false
    }
    const webpackConfig = {
        mode: "production",
        output: {
            filename: "jsb.js"
        }
    };
    return src("./src/*.ts").pipe(ts(tsConfig)).pipe(umd()).pipe(uglify()).pipe(webpack(webpackConfig)).pipe(dest("releases/"));
});

task("types", function () {
    return src("./dist/*.d.ts").pipe(dest("types/"));
});