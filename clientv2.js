var net = require('net');
var crypt = require('./crypt');
var colors = require('colors');
var readline = require('readline');

var client;
var user = 'default';
var color = 'green';
var passwd = 'default';

setup();

function connect(host, port) {
	var options = {
		"host" : host,
		"port" : port
	};

	client = net.connect(options, function () {
		console.log('Connected to', host, ':', port);
		process.stdin.resume();

		process.stdin.on('data', function (chunk) {
			var com = {
				msg : crypt.encrypt(chunk.toString(), 'aes192', passwd),
				user : user,
				color : color
			};

			client.write(JSON.stringify(com));
		})
	});

	client.on('data', function (data) {
		data = JSON.parse(data.toString());
		process.stdout.write(crypt.decrypt(data.msg, 'aes192', passwd).toString()[data.color]);
	});
}

function setup () {
	var rl = readline.createInterface({input: process.stdin, output: process.stdout});
	rl.question("Please insert ip and port (ip:port -> localhost:9648)", function (ip) {
		rl.close();
		var host = ip.split(':')[0];
		var port = parseInt(ip.split(':')[1]);
		if (!host) host = 'localhost';
		if (!port) port = 9648;

		connect(host, port);
	});

}