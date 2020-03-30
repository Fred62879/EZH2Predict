const express = require('express');
const app = express();
const R = require("r-script");
const bodyParser = require("body-parser");
const fs = require('fs');

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var data = [];

app.get('/', (req, res) => res.redirect('/ml'));

app.get('/test', (req, res) => {
    res.render('index.ejs', { data:data });
});

app.get('/ml', (req, res) => {
    res.render('index.ejs', { data: data});
});

app.post('/ml', (req, res) => {
    const n = req.body.n;
    const m = req.body.m;
    var r = R(__dirname + '/ml.R').
        data(n, m).
        callSync()
    for (var i = 0; i < r.length; i++)
        data.push(r[i]);

    console.log(data);
    res.redirect('/ml');
});

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'));
