import fs from 'fs';

fs.readFile('./tests/chorales.csv', 'utf-8', (e, data) => $.analyse(data));

const $ = {
    analyse(data) {
        this.previous = [];
        const lines = data.split('\n');
        for (const line of lines) {
            const row = line.split(',');
            if (line === '') {
                return;
            }
            if (row[1] === '1') {
                this.previous = [];
            }
            if (row[16] !== this.previous[16]) {
                $.log(row);
            } else {
                if (Number(row[15]) >= 3) {
                    $.log(row);
                }
            }

            this.previous = row;
        }
    },

    log(row) {
        console.log(row[0], row[1], row[14], row[15], row[16]);
    }
}

// fs.writeFile('./tests/data.json', '', () => null);