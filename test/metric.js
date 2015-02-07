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

		var metric2 = new Metric({name:'a', namespace:'b', subSystem: 'c', help: 'help',});
		expect(metric2.fqn).to.equal('b_c_a');

		var metric3 = new Metric({name:'a', namespace:'b', help: 'help',});
		expect(metric3.fqn).to.equal('b_a');

		var metric4 = new Metric({name:'a', subSystem:'c', help: 'help',});
		expect(metric4.fqn).to.equal('c_a');

		var metric5 = new Metric({name:'a', help: 'help',});
		expect(metric5.fqn).to.equal('a');

		done();
	});
	it('validate label objects keys', function(done){
		
		var error1;
		try{
			var metric1 = new Metric({name: 's', labels: ['01', '10'], help:'help'});
		} catch (e) {
			error1 = e;
		}
		expect(error1).to.exist();

		var error2;
		try{
			var metric2 = new Metric({name: 'd', labels: ['_a','b'], help:'help'});
		} catch (e) {
			error2 = e;
		}
		expect(error2).to.not.exist();

		var error3;
		try{
			var metric3 = new Metric({name: 'v', labels: ['a_', 'b10'], help:'help'});
		} catch (e) {
			error3 = e;
		}
		expect(error3).to.not.exist();

		var error4;
		var metric4;
		try{
			metric4 = new Metric({name: 'v', constLabels: {'a_': 10, 'b10': 35}, help:'help'});
		} catch (e) {
			error4 = e;
		}
		expect(error4).to.not.exist();
		
		metric4 = undefined;
		error4 = undefined;
		try{
			metric4 = new Metric({name: 'v', constLabels: {'0a': 10, 'b10': 35}, help:'help'});
		} catch (e) {
			error4 = e;
		}
		expect(error4).to.exist();

		metric4 = undefined;
		error4 = undefined;
		try{
			metric4 = new Metric({name: 'v', constLabels: {'aa': 10, 'b10': 35}, labels: ['a_', 'b10'], help:'help'});
		} catch (e) {

			error4 = e;
		}
		expect(error4.details[0].type).to.equal('object.nand');

		done();
	});
});