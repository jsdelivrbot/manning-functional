// browser: http://localhost:3000/ch01/listing1_6/listing1_6.html

var valid = false;
var elem = document.querySelector('#student-ssn');
elem.onkeyup = function (event) {
	var val = elem.value;
	if(val !== null && val.length !== 0) {
		val = val.replace(/^\s*|\s*$|\-/g, '');
		if(val.length === 9) {
			console.log(`Valid SSN: ${val}!`);
			valid = true;
		}		
	}
	else {
		console.log(`Invalid SSN: ${val}!`);
	}
};