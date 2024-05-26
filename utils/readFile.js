const fs = require("fs")

function readFile(arg) {
    return new Promise((resolve, reject) => {
        fs.readFile(arg, function(error, stdout, stderr) {
            if (error) {
                reject(error);
            } else {
                resolve(stdout.toString());
            }
        });
    });
}

module.exports = readFile
