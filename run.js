var PClient = require('./index');

var client = new PClient.Client();

client.connect({});

var metric = new PClient.Metric();