var net = require('net');
var crypt = require('./crypt');
var colors = require('colors');
var readline = require('readline');

var command = require('./commands');
var client;

setup();

function connect(host, port) {
	var options = {
		"host" : host,
		"port" : port
	};

	client = net.connect(options, function () {
		process.stdout.write('Connected to ' + host + ':' + port + '\n');
		process.stdin.resume();

		process.stdin.on('data', function (chunk) {
			if (command.check(chunk.toString(), client)) {
				var com = {
					msg : crypt.encrypt(chunk.toString(), command.settings),
					user : command.settings.username,
					color : command.settings.color
				};

				client.write(JSON.stringify(com));
			}
		})
	});

	client.on('data', function (data) {
		data = JSON.parse(data.toString());
		var message = (data.user == command.settings.username ? 'you' : data.user) + " : " + crypt.decrypt(data.msg, command.settings).toString();
		for (i = 0; i < data.color.length; i++) {
			message = message[data.color[i]];
		}
		process.stdout.write('\n' + message + '\n');
	});
}

function setup () {
	var rl = readline.createInterface({input: process.stdin, output: process.stdout});
	rl.question("Please insert ip and port (ip:port -> localhost:9648)", function (ip) {
		rl.close();
		var host = ip.split(':')[0] == '' ? 'localhost' : ip.split(':')[0];
		var port = ip.split(':')[1] == undefined ? 9648 : parseInt(ip.split(':')[1]);
		connect(host, port);
	});
}