var tcp=require(process.cwd()+"/TCPServer.js");
var http=require('http');
var dummyCoordinates={
	"lattitude":23.0934,
	"longitude":30.6460
};

tcp.setupTCPServer();
var server=http.createServer(function(req,res){
	console.log("got request");
	dummyCoordinates.lattitude= dummyCoordinates.lattitude + 1;
	dummyCoordinates.longitude= dummyCoordinates.longitude + 1;
	res.writeHead(200, { 'Content-Type': 'application/json'});
	res.end(JSON.stringify(dummyCoordinates));
});
server.listen(8090);
