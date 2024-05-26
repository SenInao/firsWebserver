var exec = require('child_process').exec;

function execRequest(arg) {
    return new Promise((resolve, reject) => {
        exec(arg, function(error, stdout, stderr) {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

module.exports = execRequest
