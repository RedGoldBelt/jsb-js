import gulp from "gulp";
const {
    task,
    src,
    dest
} = gulp;
import umd from "gulp-umd";
import webpack from "webpack-stream";
import uglify from "gulp-uglify";

const config = {
    mode: "production",
    output: {
        filename: "jsb.js"
    }
};

task("build", function () {
    return src("./dist/*.js").pipe(umd()).pipe(uglify()).pipe(webpack(config)).pipe(dest("releases/"));
});
