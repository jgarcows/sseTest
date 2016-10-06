var http = require("http");
var fs = require("fs");

var logFile = "sse.log"
var port = (process.env.VCAP_APP_PORT || 3000);

http.createServer(function (req, res) {
  var interval;
  
  var remoteAddr = ""+req.socket.remoteAddress + ":" +req.socket.remotePort;
  var localAddr = ""+req.socket.localAddress+":"+req.socket.localPort;
  
  
  fs.appendFile(logFile, "Incoming request started at " + (new Date()) + 
      "\n\turl: "+ req.url +
      "\n\theaders: "+ JSON.stringify(req.headers) +
      "\n\tremoteAddr: "+ remoteAddr +
    "\n\tlocalAddr: "+ localAddr +"\n");
    
  console.log("Incoming request started at " + (new Date()) + 
      "\n\turl: "+ req.url +
      "\n\theaders: "+ JSON.stringify(req.headers) +
      "\n\tremoteAddr: "+ remoteAddr +
    "\n\tlocalAddr: "+ localAddr +"\n");
  

  if (req.url === "/stream") {
    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
    res.write("retry: 10000\n");
    res.write("event: connecttime\n");
    res.write("data: " + (new Date()) + "\n\n");
    res.write("data: " + (new Date()) + "\n\n");

    interval = setInterval(function() {
      res.write("data: " + (new Date()) + "\n\n");
    }, 1000);
    req.connection.addListener("close", function () {
      clearInterval(interval);
      fs.appendFile(logFile, "Streaming request finished at " + (new Date()) + 
          "\n\turl: "+ req.url +
          "\n\theaders: "+ JSON.stringify(req.headers) +
          "\n\tremoteAddr: "+ remoteAddr +
      "\n\tlocalAddr: "+ localAddr +"\n");
      console.log("Streaming request finished at " + (new Date()) + 
          "\n\turl: "+ req.url +
          "\n\theaders: "+ JSON.stringify(req.headers) +
          "\n\tremoteAddr: "+ remoteAddr +
      "\n\tlocalAddr: "+ localAddr +"\n");
    }, false);
  } else if (req.url === "/log") {
    fs.readFile(logFile, function(error, content) {
        if (error) {
            res.writeHead(500);
            res.end();
        } else {
            res.writeHead(200, {"Content-Type":"text/html"});
            res.end(content, "utf-8");
        }
    });
  } else {
    res.writeHead(200, {"Content-Type":"text/html"});
    res.end("<html><body><p> Try going to /stream or /log </p></body></html>\n", "utf-8");
  }
}).listen(port);
console.log("Server running on port" + port);
fs.appendFile(logFile, "Server running on port "+port +"\n");