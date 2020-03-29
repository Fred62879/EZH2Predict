const express = require('express');
const app = express();
const R = require("r-script");
const bodyParser = require("body-parser");

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// function ml() {
//     var child_process = require('child_process');
//     var file_path = 'r/mlscript.R';
//     var r_comm = '/usr/bin/Rscript';
//     var rspawn = child_process.spawn(r_comm, [file_path]);
//     // var rspawn = spawn(r_comm, [file_path]);

//     rspawn.stdout.on('data', function (data) {
// 	    console.log(data.toString());
//     });

//     rspawn.stderr.on('data', function (data) {
// 	    console.log('stderr: ' + data);
// 	    console.log(data.toString().search("error"));
// 	    console.log(rspawn.connected);
// 	    if ((data.toString().search("error") != -1) ) {
// 		    console.log('process has been killed - "error" keyword found in stderr!');
// 		    rspawn.kill('SIGTERM');
// 	    }
//     });

//     rspawn.on('close', function (code) {
// 	    console.log('child process exited with code ' + code);
//     });
// }

var data = null;

app.get('/', (req, res) => res.redirect('/ml'));

app.get('/test', (req, res) => {
    res.render('index.ejs', { data:data });
});

app.get('/ml', (req, res) => {
    res.render('index.ejs', {data:data});
});

app.post('/ml', (req, res) => {
    console.log(1);
    const a = req.params.a;
    console.log(2);
    // var r = R('./public/r/ml.R')
    var r = R('./ml.R')
        .callSync()
    // res.json(r);
    // console.log(r[0]);
    data = { name: "test", accuracy: r };
    res.redirect('/ml');
});

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'));
