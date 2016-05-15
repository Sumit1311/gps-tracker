const dgram = require('dgram');
const server = dgram.createSocket('udp4');

function setupUDPServer(){
	server.on('error', (err) => {
		console.log(`server error:\n${err.stack}`);
		server.close();
	});

	server.on('message', (msg, rinfo) => {
		console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
	});

	server.on('listening', () => {
	  var address = server.address();
	  console.log(`UDP server listening ${address.address}:${address.port}`);
	});
	// server listening 0.0.0.0:41234
	server.bind(41234);
}
