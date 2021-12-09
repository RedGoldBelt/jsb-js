import gulp from "gulp";
const {
    task,
    src,
    dest
} = gulp;
import webpack from "webpack-stream";

const config = {
    mode: "production",
    output: {
        filename: "jsb.js",
        library: {
            name: "JSB",
            type: "global"
        }
    },
    optimization: {
        minimize: false
    }
};

task("build", function () {
    return src("./dist/*.js").pipe(webpack(config)).pipe(dest("releases/"));
});