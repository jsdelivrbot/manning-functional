exports.Wrapper = class Wrapper {
	constructor(value) {
		this._value = value;
	}
	// map :: (A -> B) -> A -> B
	map(f) {
		//console.log("map(f): " + this._value);
		return f(this._value);
	}

	// fmap :: (A -> B) -> Wrapper[A] -> Wrapper[B]
	fmap (f) {
		return new Wrapper(f(this._value));
	}

	toString() {
		return 'Wrapper (' + this._value + ')';
	}
};

// wrap :: A -> Wrapper(A)
const wrap = (val) => new exports.Wrapper(val);

module.exports = {
	wrap: wrap
};