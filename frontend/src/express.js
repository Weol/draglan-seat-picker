const express = require('express');
const proxy = require('express-http-proxy');
const app = express();


app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next();
});


app.use(express.static('/home/site/wwwroot'));
app.use('/api', proxy('www.seatpicker-backend.azurewebsites.net'));

app.get('/*', function (req, res) {
    res.sendFile('/home/site/wwwroot/index.html');
});


app.listen(8080);