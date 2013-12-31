// Load dependencies
var express = require('express'),
    ThunderConnector = require('thunder-connector');



// Init express
var app = express();





// gzip / deflate
app.use(express.compress());
// Load static files
app.use(express.static(__dirname + '/app'));





// Handle the default route
app.get('/', function(req, res) {

  // Display the app if no action is given (initial state)
  if (!req.param('action')) {
    // Load the application page
    res.sendfile("app/app.html");

  // Send a response if an action was triggered
  } else {
    // Send a command to the device
    var result = ThunderConnector.command(req.param('action'));

    // Create the result
    result = {
      'action' : req.param('action'),
      'result' : result
    };

    // Send the result back to the client
    res.json(result);
  }
});





// Listen on port for connection
app.listen(1337);
console.log('Server started on http://localhost:1337');