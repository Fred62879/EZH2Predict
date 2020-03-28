(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var child_process = require('child_process');
var rspawn = child_process.spawn(r_comm, [file_path]);
// var spawn = require('child_process').spawn;

// var file_path = '../r/rcode.R';
var file_path = 'r/mlscript.R';
var r_comm = '/usr/bin/Rscript';
// var rspawn = spawn(r_comm, [file_path]);

rspawn.stdout.on('data', function (data) {
	console.log(data.toString());
});

rspawn.stderr.on('data', function (data) {
	console.log('stderr: ' + data);
	console.log(data.toString().search("error"));
	console.log(rspawn.connected);
	if ((data.toString().search("error") != -1) ) {
		console.log('process has been killed - "error" keyword found in stderr!');
		rspawn.kill('SIGTERM');
	}
});

rspawn.on('close', function (code) {
	console.log('child process exited with code ' + code);
});

},{"child_process":2}],2:[function(require,module,exports){

},{}]},{},[1]);
