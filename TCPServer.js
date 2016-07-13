var net = require('net');
var db = require(process.cwd() + "/db/api");
var fileLogger = require(process.cwd() + "/logger/api.js");
var server;
exports.setupTCPServer = setupTCPServer;
function setupTCPServer() {
    server = net.createServer(function (socket) {
        socket.on('data', function (data) {
            console.log("Message from client : ", data.toString());
            var string = data.toString();
            var strtok = string.split(',');
            var coordinates = {
                lattitude: strtok[3],
                longitude: strtok[5]
            };
            console.log("Received coordinates : ", coordinates);
            fileLogger.appendMessage(JSON.stringify(coordinates));
            db.coordinates.saveCoordinates("1", coordinates.lattitude, coordinates.longitude)
                .then(function () {
                    console.log("Received coordinates : ", coordinates);
                })

        });
    });
    server.on("listening", function () {
        console.log("listening now....");
    })
    server.listen(1337);
};
