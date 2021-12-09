import { task, src, dest } from "gulp";
import concat from "gulp-concat";
import uglify from "gulp-uglify";

task("build", function () {
    return src("./dist/*.js")
        .pipe(concat("jsb.js"))
        .pipe(uglify())
        .pipe(dest("build/"));
});

task("types", function () {
    return src("./dist/*.d.ts")
        .pipe(dest("types/"));
});