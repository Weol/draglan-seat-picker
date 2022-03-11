const express = require('express');
const proxy = require('express-http-proxy');
const app = express();

app.use(function(request, response, next) {
    if (!request.secure) {
        return response.redirect("https://" + request.headers.host + request.url);
    }
    next();
})

app.use(express.static('/home/site/wwwroot'));
app.use('/api', proxy('seatpicker-backend.azurewebsites.net'));

app.get('/*', function (req, res) {
    res.sendFile('/home/site/wwwroot/index.html');
});


app.listen(8080);