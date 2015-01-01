//commands.js
var settings = JSON.parse(require("fs").readFileSync(__dirname + "/config.json"));
var crypt = require('./crypt');
var fs = require('fs');

module.exports = {
	"check" : check,
	"password" : password,
	"color" : color,
	"clear" : clear,
	"exit" : exit,

	"settings" : settings
};

function check(data, client) {
	if (module.exports[data.replace(/\/|\n/g, "").split(" ")[0]] && data.substr(0, 1) == "/") {
		var cmd = data.replace(/\/|\n/g, "").split(" ");
		module.exports[data.replace(/\/|\n/g, "").split(" ")[0]](cmd, client);
		return false;
	}
	else {
		if (data.substr(0, 1) == "/") {process.stdout("Command not found."); return false;}
		else return true;
	}
}

function password(cmd) {
	if (cmd.length > 1){
		settings.password = cmd.splice(1).join(" ");
		process.stdout.write("Selected password : " + settings.password + '\n\n');
		write();
	}
	else process.stdout.write("Commands needs following parameter : password\n\n");
	return;
}

function color(cmd) {
	var colors = ["red", "black", "green", "yellow", "blue", "magenta", "cyan", "white", "gray", "grey", "rainbow", "zebra", "america", "trap", "random", "reset", "bold", "dim", "italic", "underline", "inverse", "hidden", "strikethrough", "bgBlack", "bgRed", "bgGreen", "bgYellow", "bgBlue", "bgMagenta", "bgCyan", "bgWhite"];
	cmd.splice(0, 1);

	for (i = 0; i < cmd.length; i++) {
		(function (i) {
			var match = false;

			for (a = 0; a < colors.length; a++) {
				if (cmd[i] == colors[a]) match = true;
			}

			if (!match) cmd.splice(i, i);
		})(i);
	}

	process.stdout.write("Selected : " + cmd.join(", ") + '\n\n');
	settings.color = cmd;
	write();
}

function clear() {
	process.stdout.write("\u001b[2J\u001b[0;0H");
	return;
}

function exit(cmd, client) {
	var com = {
		msg : crypt.encrypt(settings.username + " has left the server", settings),
		user : settings.username,
		color : settings.color
	};

	client.write(JSON.stringify(com));
	client.end();
	clear();
	process.stdout.write("Press any button to crash cryptonet.");
	
	return;
}

function write() {
	module.exports.settings = settings;
	fs.writeFileSync('config.json', JSON.stringify(settings));
	return;
}