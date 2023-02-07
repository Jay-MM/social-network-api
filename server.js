const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/create', (req,res)=>{})

app.get('/read', (req,res)=>{})

app.listen(PORT, () => console.log(`Server connected on localhost:${PORT}`));