const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jsdom = require('jsdom');
const queue = require('bull');
const R = require("r-script");

const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = require("jquery")(window);

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

let PORT = process.env.PORT || '3000';
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let workqueue = new queue('work', REDIS_URL);

var data = [];


app.get('/', (req, res) => res.redirect('/ml'));

app.get('/biobg', (req, res) => {
    res.render('bio.ejs', { data: data});
});

app.get('/compbg', (req, res) => {
    res.render('comp.ejs', { data: data});
});

app.get('/ml', (req, res) => {
    res.render('index.ejs', { data: data});
    data = [];
});

app.post('/ml', (req, res) => {
    const n = req.body.n;
    const m = req.body.m;
    console.log(__dirname + '/public/r/ml.R');
    var r = R(__dirname + '/ml.R').data(n, m).callSync()
    data.push({ name: "test", accuracy: r });
    console.log(data);
    res.redirect('/ml');
});

app.post('/ml3', async(req, res) => {
    const n = req.body.n;
    const m = req.body.m;
    let job = await workqueue.add({ n:n, m:m });
    for (var i = 0; i < r.length; i++)
        data.push(r[i]);
    res.redirect('/ml');
});

app.post('/ml2', async(req, res) => {
    const n = req.body.n;
    const m = req.body.m;
    r = R(__dirname + '/ml.R').data(n, m).callSync();
    for (var i = 0; i < r.length; i++)
        data.push(r[i]);
    res.redirect('/ml');
});

app.listen(PORT, () => console.log("Server started"));
