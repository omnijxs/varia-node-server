const express = require('express');
const router = express.Router();
const { asyncMiddleware } = require('./middleware');

router.get('/hello', asyncMiddleware(async (req, res) => {
    res.send("world");
}));

module.exports = router;