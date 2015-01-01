var crypto = require('crypto');
var clearEncoding = 'utf8';
var cipherEncoding = 'binary';

module.exports = {
	encrypt : function (str, settings) {
		var cipher = crypto.createCipher(settings.crypt, settings.password);

		var cipherChunks = [];

		cipherChunks.push(cipher.update(str, clearEncoding, cipherEncoding));

		cipherChunks.push(cipher.final(cipherEncoding));

		return cipherChunks;
	},
	decrypt : function (str, settings) {

		var plainChunks = [];
		try {
			var decipher = crypto.createDecipher(settings.crypt, settings.password);
			for (var i = 0;i < str.length;i++) {

			  plainChunks.push(decipher.update(str[i], cipherEncoding, clearEncoding));

			}

			plainChunks.push(decipher.final(clearEncoding));
			return plainChunks.join('');

		}
		catch (err) {
			
			return str.join('');
		}
	}
}