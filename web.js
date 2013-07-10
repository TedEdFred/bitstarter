var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
	var fs = require('fs');
	fs.readFileSync('./index.html', function (err, data) {
	  if (err) response.send(err); //throw err;
	  console.log(data);
	  response.send(data);
	});
  //response.send('Hello World 2!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

var readFile = function() {

		
};