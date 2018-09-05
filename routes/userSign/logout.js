'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/logout.html', function(req, res) {
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
