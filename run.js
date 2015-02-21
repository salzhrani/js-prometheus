var PClient = require('./index');
console.log(PClient);
var client = new PClient.Client();




client.connect({});



// var metric = new PClient.Metric();
var counter1 = new PClient.Counter({
	name: 'Counting'
});
client.addMetric(counter1);

counter1.inc();

var counter2 = new PClient.Counter({
	name: 'Counting labels',
	labels: ['account', 'amount']
});

client.addMetric(counter2);

counter2.labels(['main', 123]).inc();