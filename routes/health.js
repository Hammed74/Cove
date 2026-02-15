const express = require('express');
const router = express.Router();

router.get('/', (_req, res) => {
    res.json({status: 'ok', timestamp: Date.now()});
    console.log("We're connected")
});

module.exports = router;