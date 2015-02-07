var Gauge = require('../lib/gauge');
var Metric = require('../lib/metric');
var CoreObject = require('core-object');
var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;


describe('Gauge', function(){
	it('initializes to zero', function(done){
		
		var gauge1 = new Gauge({name: 'testGauge', help:'Help'});
		console.log('instanceof', gauge1 instanceof CoreObject);
		expect(gauge1.val+'').to.equal('0');
		done();
	});
	it('adds properly', function(done){
		
		var gauge3 = new Gauge({name: 'testGauges',help:'help'});
		gauge3.add(3);
		expect(gauge3.val === 3).to.be.true();
		gauge3.add(4);
		expect(gauge3.val === 7).to.be.true();
		var errored = false;
		try {
			gauge3.add('a');
		} catch(e){
			errored = true;
		}
		expect(errored).to.be.true();
		done();
	});
	it('allows setting', function(done){
		
		var gauge4 = new Gauge({name: 'hello', help: 'Help'});
		var error = false;
		gauge4.set(4);
		expect(gauge4.val+'').to.equal('4');
		gauge4.set(7);
		expect(gauge4.val+'').to.equal('7');
		try {
			gauge4.set('av');
		} catch(e) {
			error = true;
		}
		expect(error).to.be.true();
		gauge4.inc();
		expect(gauge4.val).to.equal(8);
		done();
	});
	it('substracts properly', function(done){
		
		var gauge5 = new Gauge({name: 'hello', help: 'Help'});
		var error = false;
		try {
			gauge5.set(10);
			gauge5.sub(1);
		} catch(e) {
			error = true;
		}

		expect(error).to.be.false();
		expect(gauge5.val+'').to.equal('9');

		gauge5.dec();
		expect(gauge5.val+'').to.equal('8');
		done();
	});
});