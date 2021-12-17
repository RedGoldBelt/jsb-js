import fs from "fs";

fs.readFile("./tests/chorales.csv", "utf8", (e, data) => {
    const split = data.split("\n");
    console.log(split.length);
});
