var express = require('express');

var app = express.createServer(express.logger());


app.get('/', function(request, response) {
	var fs = require('fs');
	console.log("Reading index.html");
	console.log(fs.readFileSync('index.html','utf-8'));
	var text = fs.readFileSync('index.html','utf-8') ;

  response.send(text);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});