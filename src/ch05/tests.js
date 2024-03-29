/**
  Chapter 5 code listings
  Author: Luis Atencio


 TO RUN:
	node 'C:\Sandpit\functional-programming-js\node_modules\qunit\bin\cli.js' -t 'src\ch05\tests.js' -c 'src\ch05\tests.js'

*/
"use strict";

QUnit.module('Chapter 5');

// Functional Libraries used in this chapter
const _ = require('lodash');
const R = require('ramda');

// Monads/functors used
const Wrapper = require('../model/Wrapper.js').Wrapper;
const wrap = require('../model/Wrapper.js').wrap;
const empty = require('../model/Empty.js').empty;
const Maybe = require('../model/monad/Maybe.js').Maybe;
const Just = require('../model/monad/Maybe.js').Just;
const Either = require('../model/monad/Either.js').Either;

// Models used
const Student = require('../model/Student.js').Student;
const Address = require('../model/Address.js').Address;
const Person = require('../model/Person.js').Person;
/*
QUnit.test("Simple Wrapper test", function () {
	const wrappedValue = wrap('Get Functional');
	assert.equal(wrappedValue.map(R.identity), 'Get Functional'); //-> 'Get Functional'

	//console.log(wrappedValue.map(log)); // if 'log' fn existed...
	//console.log(wrappedValue.map(R.toUpper));
});

 
QUnit.test("Simple functor test", function () {
	const plus = R.curry((a, b) => a + b);
	const plus3 = plus(3);
	const plus10 = plus(10);
	const two = wrap(2);
	const five = two.fmap(plus3); //-> Wrapper(5)
	assert.equal(five.map(R.identity), 5); //-> 5

	assert.equal(two.fmap(plus3).fmap(plus10).map(R.identity), 15); //-> Wrapper(15)
});



QUnit.test("Simple find with wrapper", function () {
	// Use helper DB created in chapter 1	
	const db = require('../ch01/helper').db;	

	const find = R.curry((db, id) => db.find(id));

	const findStudent = R.curry((db, ssn) => {
		return wrap(find(db, ssn));
	});
	
	const getFirstName = (student) => {
		return wrap(student.fmap(R.prop('firstname')));
	};

	const studentFirstName = R.compose(
		getFirstName,
		findStudent(db)
	);

	// double wrapped
  console.log(studentFirstName('444-44-4444'));

	assert.deepEqual(studentFirstName('444-44-4444'), wrap(wrap('Alonzo')));

	return;
	// JMC unwrapped 
	var result = find(db, 'empty');
	console.log(result); // undefined
	result = find(db, '444-44-4444');
	console.log(result); // Person

	//wrapped
	result = findStudent(db, '444-44-4444');
	console.log(result); // Wrapped-Person
	result = findStudent(db, 'empty');
	console.log(result); // Wrapped-undefined



});


QUnit.test("Simple empty container", function () {
	
	const isEven = (n) => Number.isFinite(n) && (n % 2 == 0);
	const half = (val) => isEven(val) ? wrap(val / 2) : empty();
	assert.deepEqual(half(4), wrap(2)); //-> Wrapper(2)
	assert.deepEqual(half(3), empty()); //-> Empty	


	var result = R.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11, [12, 13, 14, 15, [16, 17, 18, 19]]], 20]]]]);
	console.log(result);
});


QUnit.test("Simple empty container", function () {
	const WrapperMonad = require('../model/monad/Wrapper.js').Wrapper;
	
	let result = WrapperMonad.of('Hello Monads!')
		.map(R.toUpper)
		.map(R.reverse)
		.map(R.reverse)
		.map(R.identity); //-> Wrapper('HELLO MONADS!')
 	
 	assert.deepEqual(result, new WrapperMonad('HELLO MONADS!'));

	 console.log(result.toString());
});


QUnit.test("Simple Maybe Test", function () {	

	// Maybe is basically an
	// abstract umbrella object for the concrete monadic structures Just and Nothing

	let result = Maybe.of('Hello Maybe!').map(R.toUpper);
 	assert.deepEqual(result, Maybe.of('HELLO MAYBE!'));
	
	assert.deepEqual(result, Maybe.just('HELLO MAYBE!'));
	assert.deepEqual(result, Just.of('HELLO MAYBE!'));

	const Nothing = require('../model/monad/Maybe.js').Nothing;
 	result = Maybe.fromNullable(null);
 	assert.deepEqual(result, new Nothing(null));

});


QUnit.test("Maybe to extract a nested property in object graph", function () {	

	let address = new Address('US');
	let student = new Student('444-44-4444', 'Joe', 'Smith', 'Harvard', 1960, address);

	const getCountry = (student) => student		
		.map(R.prop('address'))
		.map(R.prop('country'))
		.getOrElse('Country does not exist!');
	
	assert.equal(getCountry(Maybe.fromNullable(student)), address.country);

	console.log(getCountry(Maybe.fromNullable(student)));
	console.log(address.country);
});



QUnit.test("Simple Either monad test", function () {	

	// Use helper DB created in chapter 1	
	const db = require('../ch01/helper').db;	

	const find = R.curry((db, id) => db.find(id));

	const Left = require('../model/monad/Either.js').Left;

	const safeFindObject = R.curry(function (db, id) {
		const obj = find(db, id);
		if(obj) {
			return Either.of(obj);
		}
		return Either.left(`Object not found with ID: ${id}`);
	});

	const findStudent = safeFindObject(db);
	let result = findStudent('444-44-4444').getOrElse(new Student());
	assert.deepEqual(result, new Person('444-44-4444', 'Alonzo', 'Church'));

	console.log(result);

	result = findStudent('xxx-xx-xxxx');
  console.log(result);
	//return;
	assert.deepEqual(result, Either.left(`Object not found with ID: xxx-xx-xxxx`));	

	assert.throws(() => {
		console.log(result.value);
	}, TypeError);

});
*/

// Common code used in the next unit tests

// Use helper DB created in chapter 1	
const db = require('../ch01/helper').db;	

// validLength :: Number, String -> Boolean
const validLength = (len, str) => str.length === len;

const find = R.curry((db, id) => db.find(id));

// checkLengthSsn :: String -> Either(String)
const checkLengthSsn = ssn => {		
	return Either.of(ssn)
		.filter(R.partial(validLength, [9]));
};

// safeFindObject :: Store, string -> Either(Object)
const safeFindObject = R.curry((db, id) => Either.fromNullable(find(db, id)));

// finStudent :: String -> Either(Student)
const findStudent = safeFindObject(db);

// csv :: Array => String
const csv = arr => arr.join(',');

const trim = (str) => str.replace(/^\s*|\s*$/g, '');
const normalize = (str) => str.replace(/\-/g, '');
const cleanInput = R.compose(normalize, trim);

QUnit.test("Using Either in show Student", function () {	
	console.info("***    Using Either in show Student ... start");
	const showStudent = (ssn) =>
		Maybe.fromNullable(ssn)
			.map(cleanInput)
			.chain(checkLengthSsn)
		 	.chain(findStudent)
		    .map(R.props(['ssn', 'firstname', 'lastname']))
		    .map (csv)
			.map (R.tap(console.log));  //-> Using R.tap to simulate the side effect (in the book we write to the DOM)

	let result = showStudent('444-44-4444').getOrElse('Student not found!')
	assert.equal(result, '444-44-4444,Alonzo,Church');
	console.info(result);

	result = showStudent('xxx-xx-xxxx').getOrElse('Student not found!');
	assert.equal(result, 'Student not found!');
	console.info(result);
	console.info("    Using Either in show Student ... END  ****");
});

QUnit.test("Monads as programmable commas", function () {	

	// map :: (ObjectA -> ObjectB), Monad -> Monad[ObjectB]
	const map = R.curry((f, container) => container.map(f));
	// chain :: (ObjectA -> ObjectB), M -> ObjectB
	const chain = R.curry((f, container) => container.chain(f));

	const lift = R.curry((f, obj) => Maybe.fromNullable(f(obj)));

	const trace = R.curry((msg, obj) => console.log(msg));

	const showStudent = R.compose(
		R.tap(trace('Student printed to the console')),
		map(R.tap(console.log)),   //-> Using R.tap to simulate the side effect (in the book we write to the DOM)

		R.tap(trace('Student info converted to CSV')),
		map(csv),

		map(R.props(['ssn', 'firstname', 'lastname'])),

		R.tap(trace('Record fetched successfully!')),
		chain(findStudent),

		R.tap(trace('Input was valid')),
		chain(checkLengthSsn),
		lift(cleanInput)
		);

	let result = showStudent('444-44-4444').getOrElse('Student not found!');
	assert.equal(result, '444-44-4444,Alonzo,Church');
});






