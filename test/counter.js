var Counter = require('../lib/counter');
var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var Int64 = require('node-int64');
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;


describe('Counter', function(){
	it('initializes to zero', function(done){
		
		var counter1 = new Counter({name: 'testCounter', help:'Help'});
		expect(counter1.val+'').to.equal('0');
		done();
	});
	it('adds properly', function(done){
		
		var counter3 = new Counter({name: 'testCounters',help:'help'});
		counter3.add(3);
		expect(counter3.val+'').to.equal('3');
		counter3.add(4);
		expect(counter3.val+'').to.equal('7');
		counter3.inc();
		expect(counter3.val+'').to.equal('8');
		var error = false;
		try {
			counter3.add('a');
		} catch(e) {
			error = true;
		}
		expect(error).to.be.true();

		done();
	});
	it('throws if decreasing', function(done){
		
		var counter4 = new Counter({name: 'hello', help: 'Help'});
		var error;
		try {
			counter4.add(-1);
		} catch(e) {
			error = true;
		}
		expect(error).to.be.true();

		error = false; 
		counter4 = new Counter({name: 'hello', help: 'Help'});
		try {
			
			counter4.add( new Int64(-1));
		} catch(e) {
			error = true;
		}
		expect(error).to.be.true();

		done();
	});
});