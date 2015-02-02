var Metric = require('../lib/metric');
var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

describe('Metric', function(){
	it('throws when not initialized with a value', function(done){
		expect(Metric).to.throw();
		done();
	});
	it('throws when invalid object is passed', function(done){
		var error;
		try {
			var metric = new Metric({});
		} catch(e) {
			error = e;
		}
		expect(error).to.exist();
		done();
	});
	it('has an expect FQN', function(done){
		var metric1 = new Metric({name: ''});
		expect(metric1.fqn).to.equal('');

		var metric2 = new Metric({name:'a', namespace:'b', subSystem: 'c'});
		expect(metric2.fqn).to.equal('b_c_a');

		var metric3 = new Metric({name:'a', namespace:'b'});
		expect(metric3.fqn).to.equal('b_a');

		var metric4 = new Metric({name:'a', subSystem:'c'});
		expect(metric4.fqn).to.equal('c_a');

		var metric5 = new Metric({name:'a'});
		expect(metric5.fqn).to.equal('a');

		done();
	});
	it('validate label objects keys', function(done){
		
		var error1;
		try{
			var metric1 = new Metric({name: '', labels: [{'01': 10}]});
		} catch (e) {
			error1 = e;
		}
		expect(error1).to.exist();

		var error2;
		try{
			var metric2 = new Metric({name: '', labels: [{'_a': 10}]});
		} catch (e) {
			error2 = e;
		}

		var error3;
		try{
			var metric3 = new Metric({name: '', labels: [{'a_': 10}]});
		} catch (e) {
			error3 = e;
		}
		expect(error3).to.not.exist();
		done();
	});
});