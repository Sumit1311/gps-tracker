var fs = require("fs");

exports.appendMessage = function (message) {
    fs.appendFileSync("logger.txt", (new Date()) + message + "\n", {
        flag: "a"
    });
};

exports.setupLogger = function () {
    fs.appendFileSync("logger.txt", "", {
        flag: "w"
    });
};