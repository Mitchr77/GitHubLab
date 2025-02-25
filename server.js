const express = require('express');
const app = express();
const port = 4000;

app.get('/', (req, res) => {
    const currentTime = new Date().toISOString();
    res.send(`Mitchell Robertson - WEB322 ${currentTime}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});