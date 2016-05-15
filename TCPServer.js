var net = require('net');
var server;
exports.setupTCPServer=setupTCPServer;
function setupTCPServer(){
   server = net.createServer(function(socket) {
        socket.on('data',function(data){
            console.log("Message from client : ",new Buffer(data));
        });
   });
    server.on("listening",function(){
        console.log("listening now....")  
    })
   server.listen(1337);
};
