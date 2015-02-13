var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

var Estimator = require('../lib/observations-stream');

describe('Estimator', function(){

	it('Initialized correnctly', function(done){
		var estimator = new Estimator();
		expect(estimator._quantiles).to.have.length(3);
		expect(estimator._quantiles[0]._quantile).to.equal(0.5);
		expect(estimator._quantiles[1]._quantile).to.equal(0.9);
		expect(estimator._quantiles[2]._quantile).to.equal(0.99);
		done();
	});

	it('accepts custom quatiles', function(done){
		var estimator = new Estimator({quantiles:{'0.7':0.1,'0.8':0.2}});
		expect(estimator._quantiles).to.have.length(2);
		expect(estimator._quantiles[0]._quantile).to.equal(0.7);
		expect(estimator._quantiles[1]._quantile).to.equal(0.8);
		done();
	});

	// it('observe values', function(done){
	// 	var estimator = new Estimator();
	// 	estimator.observe(Math.random());
	// 	expect(estimator._observations).to.equal(1);
	// 	done();
	// });

	it('calculates', function(done){
		var estimator = new Estimator();
		estimator.observe(0.8);
		estimator.observe(0.4);
		estimator.observe(0.9);
		estimator.observe(0.6);
		expect(estimator.query(0.5)).to.equal(0.6);
		expect(estimator.query(0.9)).to.equal(0.8);
		expect(estimator.query(0.99)).to.equal(0.8);
		done();
	});
});