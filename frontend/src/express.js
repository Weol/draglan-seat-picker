const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.static('/home/site/wwwroot'));

app.get('/*', function (req, res) {
    res.sendFile('/home/site/wwwroot/index.html');
});

app.listen(8080);