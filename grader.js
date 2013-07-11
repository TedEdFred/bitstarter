#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var util = require('util');

var program = require('commander');
var cheerio = require('cheerio');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertUrlExists = function(infile) {
    var instr = infile.toString();
//    if(!fs.existsSync(instr)) {
//        console.log("%s does not exist. Exiting.", instr);
//        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
//    }
		console.error("assertUrlExists returning: " + instr);
    return 'http://www.facebook.com'; //instr;
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var cheerioHtmlFile = function(htmlfile) {
    //return cheerio.load(fs.readFileSync(htmlfile));
		var response2consoleHtml = buildHtmlFunction();
		//console.error("ReadFile: " + htmlfile);
    fs.readFile(htmlfile, response2consoleHtml);
};

var buildHtmlFunction = function() {
	var response2console = function (err,data) {
	  if (err) throw err;
	  
		//console.log("buildHtmlFn: " + data);
	  outputToConsole(data);
	  //console.log("finished buildHtmlFunction");
  };
	return response2console;
};

var cheerioUrl = function(urlPath) {
	console.error("urlPath: " + urlPath);
	//return;
	var rest = require('restler');
	var response2console = buildUrlfn();
	cheerio.load(
//		rest.get(urlPath).on('complete',response2console)
		rest.get(urlPath).on('complete',response2console)
	);
};

var buildUrlfn = function() {
		var response2console = function(result,response) {
	    //console.log("outJson");
			if (result instanceof Error) {
				console.error('Error: ' + util.format(response.message));
				return;
			}
			console.log("buildUrlFn");
    	outputToConsole(response);
	//    return out;
		};
		return response2console;
		
	};

var outputToConsole = function(stringOut) {
			//console.log(stringOut + "");
			//return;
			$ = cheerio.load(stringOut);
	    var checks = checksFile; // loadChecks(checksfile).sort();
	    var out = {};
	    for(var ii in checks) {
	        var present = $(checks[ii]).length > 0;
	    		//console.error("ii: " + ii + " present: " + present + " checks[ii]: " + checks[ii]);
	        out[checks[ii]] = present;
	    }

	    //console.log("stringOut: " + stringOut);
	    //console.log("out: " + out);
	    var outJson = JSON.stringify(out, null, 4);
	    //console.log("outJson");
	    console.log(outJson);
};

var checksFile;

var checkHtmlFile = function(htmlfile, checksfile) {
		if (program.url!=undefined) { 
			//console.error("SDFSDFSDF");
			$ = cheerioUrl(htmlfile);
		} else {
	    $ = cheerioHtmlFile(htmlfile);
 		}
		checksFile = loadChecks(checksfile).sort();
//    var out = {};
//    for(var ii in checks) {
//        var present = $(checks[ii]).length > 0;
//        out[checks[ii]] = present;
//    }
//    return out;
};

var getUrl = function(urlPath) {

	var response2console = outputToConsole();
	rest.get(urlPath).on('complete', response2console);
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};


if(require.main == module) {
    program
        .option('-u, --url <url_file>', 'Path to url', clone(assertUrlExists), 'http://www.stuff.co.nz')
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .parse(process.argv);

		//console.error("file: " + program.file);
		//console.error("checks: " + program.checks);
		console.error("Program Url: " + program.url);
		console.error("Test: " + program.test);
		console.error("Program.url == undefined?: " + (program.url==undefined));
    if (program.url!=undefined) {
//	  	var checkJson = checkHtmlFile(program.url, program.checks);
			console.error("checkHTMLFile(url)");
			checkHtmlFile(program.url, program.checks);
    } else {
//    	var checkJson = checkHtmlFile(program.file, program.checks);
    	//console.error("checkHTMLFile(file)");
    	checkHtmlFile(program.file, program.checks);
    }
//    var outJson = JSON.stringify(checkJson, null, 4);
//    console.log("outJson");
//    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}