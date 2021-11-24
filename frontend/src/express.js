const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

sdfgjoisj49q3j+9j3+}}}}}

app.use(express.static('/home/site/wwwroot'));

app.get('/*', function (req, res) {
    res.sendFile('/home/site/wwwroot/index.html');
});

app.listen(8080);