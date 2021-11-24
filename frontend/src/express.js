const express = require('express');
const app = express();

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next();
});

app.use(express.static('/home/site/wwwroot'));

app.get('/*', function (req, res) {
    res.sendFile('/home/site/wwwroot/index.html');
});

app.listen(8080);