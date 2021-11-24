var express = require('express');
var app = express();

app.use(express.static('/home/site/wwwroot'));

app.get('/*', function (req, res) {
    res.sendFile('/home/site/wwwroot/index.html');
});

app.listen(8080);