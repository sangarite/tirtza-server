const express = require('express');
const sql = require('mssql');
const multer = require('multer');
const bcrypt = require('bcrypt');
const cors = require('cors');

const login = require('./controllers/login');
const register = require('./controllers/register')
const pictures = require('./controllers/pictures');

var storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});

const app = express();
const upload = multer({storage: storage, preservePath: true});

app.use(express.json());
app.use(cors());
app.use(express.static('uploads'))
app.use(upload.single('photo'));
const port = 3003;

const config = {
  user: 'linkme1',
  password: 'Ei6B5h~T91~0',
  server: 'den1.mssql7.gear.host',
  database: 'linkme1',
  "options": {
    "encrypt": true,
    "enableArithAbort": true
  }
};

var connection = new sql.ConnectionPool(config);

app.post('/login', login.handleLogin(connection, sql, bcrypt));
app.post('/pictures', function(req, res) {res.send('image inserted')});
app.post('/addpicture', pictures.addPictures(connection, sql));
app.post('/register', register.handleRegister(connection, sql, bcrypt));
app.get('/pictures/:group', pictures.getPictures(connection, sql));
app.get('/', (req, res) => {res.send('You are at Link Me')});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})