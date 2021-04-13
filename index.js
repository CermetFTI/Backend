const express = require('express');

const app = express();

const POST = process.env.POST || 5000;

app.listen(PORT, console.log(`Server started at post : ${PORT}`))
