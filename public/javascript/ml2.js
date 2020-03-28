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
