const gulp = require("gulp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

gulp.task("build", function () {
    return gulp.src("./dist/*.js")
        .pipe(concat("bundle.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build/"));
});

gulp.task("types", function () {
    return gulp.src("./dist/*.d.ts")
        .pipe(gulp.dest("types/"));
});