var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    (function (req, res, next) {
        var host = req.get('host');
        if (host == "localhost:8080") {
            res.sendFile(path.resolve(__dirname, "../views/thor.html"));
        } else {
            res.sendFile(path.resolve(__dirname, "../views/thor.html"));
        }
    })(req, res, next);
});

module.exports = router;
