/**
  Chapter 1 code listings
  Author: Luis Atencio

	to run:
	node 'C:\Sandpit\functional-programming-js\node_modules\qunit\bin\cli.js' -t 'src\ch01\tests.js' -c 'src\ch01\tests.js'

	 node 'C:\Sandpit\functional-programming-js\node_modules\qunit\bin\cli.js' 
	 -t 'src\ch01\tests.js' -c 'src\ch01\tests.js'
*/

"use strict";

const R = require('ramda');
const _ = require('lodash');

// Print versions
console.log('Using Lodash: ' + _.VERSION);

QUnit.module('Chapter 1');

// Use "run" as an alias in chapter 1. This is shown to just
// warm up to the concept of composition
const run = R.compose;

QUnit.test("Listing 1.1 Functional printMessage", function () {
    // The book uses the DOM to print. I'll use the console instead in Node. 
    // But it's the same mechanism

    const printToConsole = str => {
    	console.log('printToConsole: ' + str);
    	return str;
    };
    const toUpperCase = str => str.toUpperCase();
    const echo = R.identity;

		const one = R.identity(1);
		//console.log(one)

    //const printMessage = run(printToConsole, toUpperCase, echo);	
		const printMessage = R.compose(printToConsole, toUpperCase, echo);
    assert.equal(printMessage('Hello World'), 'HELLO WORLD');
});
 
 
QUnit.test("Listing 1.2 Extending printMessage", function () {
    // The book uses the DOM to print. I'll use the console instead in Node. 
    // But it's the same mechanism

    const printToConsole = str => {
    	console.log(str);
    	return str;
    };
    const toUpperCase = str => str.toUpperCase();
    const echo = R.identity; 

    const repeat = (times) => {
    	return function (str = '') {
    		let tokens = [];
	    	for(let i = 0; i < times; i++) {
	    		tokens.push(str);
	    	}
    		return tokens.join(' ');	
    	};    	
    };

    const printMessage = R.compose(printToConsole, repeat(3), toUpperCase, echo);	
    assert.equal(printMessage('Hello World'), 'HELLO WORLD HELLO WORLD HELLO WORLD');
});


QUnit.test("Listing 1.3 Imperative showStudent function with side effects", function () {
    // The book uses a mock storage object in chapter 1.
    const db = require('./helper').db;
    
    function showStudent(ssn) {
    	let student = db.find(ssn);    	
    	if(student !== null) {
    		let studentInfo = `<p>${student.ssn},${student.firstname},${student.lastname}</p>`;
			console.log(studentInfo);
    		return studentInfo;
    	}
    	else {
    		throw new Error('Student not');
    	}
    }
    
    assert.equal(showStudent('444-44-4444'), '<p>444-44-4444,Alonzo,Church</p>');
});


// Using alias for curry
const curry = R.curry;

QUnit.test("Listing 1.4 Decomposing the showStudent program", function () {
    // The book uses a mock storage object in chapter 1.
    // Instead of appending to the DOM, I write to the console

    const db = require('./helper').db;
    
    const find = curry((db, id) => {
    	let obj = db.find(id);
    	if(obj === null) {
    		throw new Error('Object not found!');
    	}
    	return obj;
    });
    
    const csv = student => `${student.ssn}, ${student.firstname}, ${student.lastname}`;

    const append = curry( (source, info) => {
			//console.warn('info: ' + info); "info: 444-44-4444, Alonzo, Church"
    	source(info);
    	return info;
    });

    const showStudent = R.compose(
    	append(console.log),
    	csv,  // return csv string .... passed into 'append'
    	find(db)   // returns student .... passed into 'csv'
	);

	assert.equal(showStudent('444-44-4444'), '444-44-4444, Alonzo, Church');
});

QUnit.test("Listing 1.5 Programming with function chains", function () {
	// array with 3 student enrollment data
	const enrollments = [
		{
			enrolled: 3,  // student enrolled in 3 courses, with avg grade of 90
			grade: 90
		},
		{
			enrolled: 1,  // student enrolled in 1 course, with avg grade of 100
			grade: 100
		},
		{
			enrolled: 1,  // student enrolled in 1 course, with avg grade of 87
			grade: 87
		},		
	];

	const result = 
	          _.chain(enrollments)
	 		   			.filter(student => student.enrolled > 1)
	           	.map(_.property('grade'))
	           	.mean()
	           	.value();

	console.log(result);    
	           
	assert.equal(result, 90);               
});


 
