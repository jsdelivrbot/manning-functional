/**
  * Chapter 4 code listings
  * Author: Luis Atencio


	TO RUN:
	node 'C:\Sandpit\functional-programming-js\node_modules\qunit\bin\cli.js' -t 'src\ch04\tests.js' -c 'src\ch04\tests.js'

  */
"use strict";

QUnit.module('Chapter 4');

const _ = require('lodash');
const R = require('ramda');

// Globally used functions throughout all code listings
// isEmpty :: String -> String
const isEmpty = s => !s || !s.trim();
// isValid :: Object -> Boolean
const isValid = val => !_.isUndefined(val) && !_.isNull(val);
// trim :: String -> String
const trim = (str) => str.replace(/^\s*|\s*$/g, '');
// normalize :: String -> String
const normalize = (str) => str.replace(/\-/g, '');

QUnit.test("Chaining methods together", function () {

	let names = ['alonzo church', 'Haskell curry', 'stephen_kleene',
				 'John Von Neumann', 'stephen_kleene'];
    
    let result = _.chain(names)
		.filter(isValid)
		.map(s => s.replace(/_/, ' '))
		.uniq()
		.map(_.startCase)
		.sort()
		.value();		

	assert.deepEqual(result, [ 'Alonzo Church', 'Haskell Curry', 'John Von Neumann', 'Stephen Kleene' ]);	
});

QUnit.test("Check Type tests", function () {

	const checkType = require('./helper').checkType;	
	assert.equal(checkType(String)('Curry'), 'Curry');
	assert.equal(checkType(Number)(3), 3);
	assert.equal(checkType(Number)(3.5), 3.5);
	let now = new Date();
	assert.equal(checkType(Date)(now), now);
	assert.deepEqual(checkType(Object)({}), {});	
	assert.throws(() => {
		checkType(String)(42)
	}, TypeError);
});

QUnit.test("Tuple test", function () {

	const Tuple = require('./helper').Tuple;	
	const StringPair = Tuple(String, String);
	const name = new StringPair('Barkley', 'Rosser');
	let [first, last] = name.values();  // In Node you need to use let
	console.log(name);
	console.log(name.values());
	assert.equal(first, 'Barkley');
	assert.equal(last, 'Rosser');
	assert.throws(() => {
		const fullname = new StringPair('J', 'Barkley', 'Rosser');	
	}, TypeError);	
});


QUnit.test("Extending the core language", function () {

	// Take the first N characters
	String.prototype.first = _.partial(String.prototype.substring, 0, _);
	let result = 'Functional Programming'.first(3); // -> 'Fun'
	assert.equal(result, 'Fun');
	
	// Convert any name into a Last, First format
	String.prototype.asName = _.partial(String.prototype.replace, /(\w+)\s(\w+)/, '$2, $1');
	result = 'Alonzo Church'.asName(); //-> 'Church, Alonzo'
	assert.equal(result, 'Church, Alonzo');

	String.prototype.explode = _.partial(String.prototype.match, /[\w]/gi);
	result = 'ABC'.explode(); //-> 
	assert.deepEqual(result, ['A', 'B', 'C']);
	
	// Parses a simple URL
	String.prototype.parseUrl = _.partial(String.prototype.match, /(http[s]?|ftp):\/\/([^:\/\s]+)\.([^:\/\s]{2,5})/);
	result = 'http://example.com'.parseUrl(); // -> ['http', 'example', 'com']
	assert.deepEqual(result, [ 'http://example.com', 'http', 'example', 'com' ]);	
});


QUnit.test("Compsition", function () {
	// const str = `We can only see a short distance ahead but we can see plenty there that needs to be done`;
	// const explode = (str) => str.split(/\s+/);
	// const count = (arr) => arr.length;

  const str = `We can only see a short distance ahead but we can see plenty there that needs to be done`;
	const explode = (str) => {	//console.log('explode'); 
															return str.split(/\s+/);}
	const count = (arr) => {		//console.log('count:' + arr.length); 
															return arr.length;}
	
	const countWords = R.compose(count, explode);

	assert.equal(countWords(str), 19); //-> 19	

});


QUnit.test("More compsition", function () {
	const trim = (str) => str.replace(/^\s*|\s*$/g, '');
	const normalize = (str) => str.replace(/\-/g, '');
	const validLength = (param, str) => str.length === param;
	const checkLengthSsn = _.partial(validLength, 9);	

	const cleanInput = R.compose(normalize, trim);
	const isValidSsn = R.compose(checkLengthSsn, cleanInput);
	let result = cleanInput(' 444-44-4444 '); //-> '444444444'
	assert.equal(result, '444444444');

	result = isValidSsn(' 444-44-4444 '); //-> true
	assert.ok(result);
});


QUnit.test("Composition with functional libraries", function () {
	// Given data: 
	let students = ['Rosser', 'Turing', 'Kleene', 'Church'];
	let grades = [80, 100, 90, 99];
	let upper = s => s.toUpperCase();

	const smartestStudent = R.compose(
		upper,
		R.head,
		R.pluck(0),
		R.reverse,
		R.sortBy(R.prop(1)),
		R.zip);

	let result = smartestStudent(students, grades); //-> 'Turing'
	//assert.equal(result, 'Turing');
	assert.equal(result, 'TURING'); // WHEN 'upper' added
});


QUnit.test("Composition as point-free functions", function () {
	// Given data: 
	let students = ['Rosser', 'Turing', 'Kleene', 'Church'];
	let grades = [80, 100, 90, 99];

	const first = R.head;
	const getName = R.pluck(0);
	const reverse = R.reverse;
	const sortByGrade = R.sortBy(R.prop(1));
	const combine = R.zip;
	let result = R.compose(first, getName, reverse, sortByGrade, combine);	
	assert.equal(result(students, grades), 'Turing');
});


QUnit.test("Show student program with currying and composition", function () {
		
	// Use the mock data from Chapter 1
	const db = require('../ch01/helper').db;	

	const find = R.curry((db, id) => db.find(id));

	// findObject :: DB -> String -> Object
	const findObject = R.curry(function (db, id) {
		console.log('id:' + id);		
		const obj = find(db, id);
		if(obj === null) {
			throw new Error(`Object with ID [${id}] not found`);
		}
		return obj;
	});
	
	// findStudent :: String -> Student
	const findStudent = findObject(db);
	
	const csv = ({ssn, firstname, lastname}) => `${ssn}, ${firstname}, ${lastname}`;
	
	// append :: String -> String -> String
	const append = R.curry(function (elementId, info) {	
		console.log(info);
		return info;
	});

	// showStudent :: String -> Integer
	const showStudent = R.compose(
		append('#student-info'),
		csv,
		findStudent,
		normalize,
		trim);

	let result = showStudent('44444-4444'); //-> 444-44-4444, Alonzo, Church
	assert.equal(result, '444-44-4444, Alonzo, Church')
});


QUnit.test("More point-free coding", function () {
	const runProgram = R.pipe(
		R.map(R.toLower),
		R.uniq,
		R.sortBy(R.identity));
	

	let result = runProgram(['Functional', 'Programming', 'Curry', 'Memoization', 'Partial', 'Curry', 'Programming']);
	assert.deepEqual(result, ['curry', 'functional', 'memoization', 'partial', 'programming']);
	//-> [curry, functional, memoization, partial, programming]

	// this is an unchained version - don't do this ==> (compare this to the Ramda.js version above)
	var data = ['Functional', 'Programming', 'Curry', 'Memoization', 'Partial', 'Curry', 'Programming']
	data = data.map(x => x.toLowerCase());
	//data = R.uniq(data); // ramda
	data = _.uniq(data); // lodash
	var sorting = R.sortBy(R.identity);
	data = sorting(data);

	//console.log(data);
	assert.deepEqual(result, ['curry', 'functional', 'memoization', 'partial', 'programming']);

	// mix libs and user definined functions:
	data = ['Functional  ', '   Progr--amming', 'Curry', '  Memoization', 'Partial  ', 'Curry', 'Programming']
	const lower = x => x.toLowerCase();
	var cleanInput = R.pipe(
		normalize,
		trim,
		lower
	)
	const appendBash = x => x + '!!'
	const getId = x => console.log(R.identity);
	const chained = R.compose(
			//R.map(getId)
			R.map(appendBash)
		,	_.reverse
		  //sorting
		,	R.sortBy(R.identity)
		, _.uniq
		//, R.map(normalize)
		//, R.map(trim)
		//, R.map(lower)
		, R.map(cleanInput)
	);

	console.log("*** chained(data) ***");
  console.log(chained(data));


});
