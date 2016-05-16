var net = require('net');
var db = require(process.cwd() + "/db/api");
var server;
exports.setupTCPServer = setupTCPServer;
function setupTCPServer() {
    server = net.createServer(function (socket) {
        socket.on('data', function (data) {
            console.log("Message from client : ", new Buffer(data));
            var coordinates = {
                lattitude: {},
                longitude: {}
            };
            db.coordinates("1")
                .then(function () {
                    console.log("Received coordinates : ", coordinates);
                })

        });
    });
    server.on("listening", function () {
        console.log("listening now....")
    })
    server.listen(1337);
};
