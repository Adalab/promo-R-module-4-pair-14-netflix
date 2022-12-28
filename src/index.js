const express = require('express');
const cors = require('cors');
// const moviesData = require('./data/movies.json');
// const usersData = require('./data/users.json');
const Database = require('better-sqlite3');

//Create database
const db = new Database('./src/db/database2.db', { verbose: console.log });

//Create and config server
const app = express();
app.use(cors());
app.use(express.json());

//Init express aplication
const serverPort = 4000;
app.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//init template engine
app.set('view engine', 'ejs');

//Endpoints
app.get('/movies', (req, res) => {
  const genderFilterParam = req.query.gender;
  const sortFilterParam = req.query.sort;

  if (genderFilterParam) {
    if (sortFilterParam === 'asc') {
      const query = db.prepare(
        'SELECT * FROM movies WHERE gender = ? ORDER BY name ASC'
      );
      const moviesList = query.all(genderFilterParam);

      res.json({
        success: true,
        movies: moviesList,
      });
    } else {
      const query = db.prepare(
        'SELECT * FROM movies WHERE gender = ? ORDER BY name DESC'
      );
      const moviesList = query.all(genderFilterParam);

      res.json({
        success: true,
        movies: moviesList,
      });
    }
  } else {
    if (sortFilterParam === 'asc') {
      const query = db.prepare('SELECT * FROM movies ORDER BY name ASC');
      const moviesList = query.all();

      res.json({
        success: true,
        movies: moviesList,
      });
    } else {
      const query = db.prepare('SELECT * FROM movies ORDER BY name DESC');
      const moviesList = query.all();

      res.json({
        success: true,
        movies: moviesList,
      });
    }
  }
});

app.post('/users', (req, res) => {
  const userLogin = req.body;

  const query = db.prepare(
    'SELECT * FROM users WHERE email = ? AND password = ? '
  );
  const userSelected = query.get(userLogin.email, userLogin.password);

  if (userSelected !== undefined) {
    const responseSuccess = {
      success: true,
      userId: userSelected.id,
    };
    res.json(responseSuccess);
  } else {
    const responseFail = {
      success: false,
      errorMessage: 'Usuaria/o no encontrada/o',
    };
    res.json(responseFail);
  }
});

app.post('/signup', (req, res) => {
  const userSignUp = req.body;
  console.log(userSignUp);
  //Gestionar login users

  //verificar si ya existe
  const query1 = db.prepare('SELECT * FROM users WHERE email = ?');
  const foundUser = query1.get(userSignUp.email);
  if (foundUser) {
    const responseFail = {
      success: false,
      errorMessage: 'Usuaria/o ya registrada/o',
    };
    res.json(responseFail);
  } else {
    //insertar nueva usuaria
    const query2 = db.prepare(
      'INSERT INTO users (email, password) VALUES ( ?,?) '
    );
    const userRegistered = query2.run(userSignUp.email, userSignUp.password);
    const responseSuccess = {
      success: true,
      userId: userRegistered.lastInsertRowid,
    };
    res.json(responseSuccess);
  }
});

app.get('/movie/:movieId', (req, res) => {
  const movieId = req.params.movieId;
  const query = db.prepare('SELECT * FROM Movies WHERE id = ?');
  const movieSelected = query.get(movieId);
  res.render('movie', movieSelected);
});

//Static servers
const staticServerPathWeb = 'src/public-react';
app.use(express.static(staticServerPathWeb));

const staticServerPathWeb2 = 'src/public-movies-images';
app.use(express.static(staticServerPathWeb2));

const staticServerPathWeb3 = 'src/public-css';
app.use(express.static(staticServerPathWeb3));
