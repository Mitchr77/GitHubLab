// Mitchell Robertson - Asignment 1

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const lineByLine = require('linebyline');

const app = express();
const PORT = 4000;

// Set Handlebars 
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Read imagelist.txt
const images = [];
const rl = lineByLine(path.join(__dirname, 'imagelist.txt'));

rl.on('line', (line) => {
    if (line.trim()) images.push(line.trim());
}).on('end', () => {
    console.log("Images displayed:", images);
});

app.get('/', (req, res) => {
    res.render('index', { images, defaultImage: images.length ? images[0] : 'default.jpg' });
});

app.get('/image', (req, res) => {
    const selectedImage = req.query.img || (images.length ? images[0] : 'default.jpg');
    res.render('index', { images, selectedImage });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});