var i2c = require('rasp2c');

i2c.detect(function(err, result) {
	if(err) {
		console.log(err);
	} else {
		console.log(result);
	}
});

i2c.dump('0xa1', '0x11-0x15', function(err, result) {
	if(err) {
		console.log(err);
	} else {
		console.log(result);
	}
});

ic2.set('0xa1', '0x11', '0xff', function(err, result) {
	if(err) {
		console.log(err);
	} else {
		console.log(result);
	}
});
