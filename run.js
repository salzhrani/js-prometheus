var PClient = require('./index');
console.log(PClient);
var client = new PClient.Client();




client.connect({});



// var metric = new PClient.Metric();
var counter = new PClient.Counter({
	name: 'Counting'
});
client.addMetric(counter);

counter.inc();