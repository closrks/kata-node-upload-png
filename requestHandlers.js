var fs = require('fs');
var querystring = require('querystring');
var formidable = require("formidable");

function favicon(response, request) {
	console.log('Request handler "favicon" was called.');
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello Favicon");
	response.end();
}

function start(response, request) {
	console.log('Request handler "start" was called.');
	
	fs.readFile('./index.html', function (error, html) {
		if (error) throw error;
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(html);
		response.end();
	});
}

function upload(response, request) {
	console.log('Request handler "upload" was called.');
	
	var form = new formidable.IncomingForm();
	console.log("about to parse");
	form.parse(request, function (error, fields, file) {
		console.log("parsing done");
		fs.rename(file.upload.path, "./tmp/test.png", function (error) {
			if (error) {
				fs.unlink("./tmp/test.png");
				fs.rename(file.upload.path, "./tmp/test.png");
			}
		});
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("received image: <br/>");
		response.write("<img src='/show' />");
		response.end();
	});
}

function show(response, request) {
	console.log("Request handler 'show' was called.");
	fs.readFile("./tmp/test.png", "binary", function (error, file) {
		if (error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		}
	});
}

exports.favicon = favicon;
exports.start = start;
exports.upload = upload;
exports.show = show;