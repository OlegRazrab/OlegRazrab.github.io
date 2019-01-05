const express = require('express');
const app = express();
const server = require('http').createServer(app);

const fs = require('fs');
const path = require('path');

let PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => {
    console.log(`Site avaible: http://localhost:${PORT}`);
});