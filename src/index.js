const express = require('express');
const cors = require('cors');
// const moviesData = require('./data/movies.json');
const usersData = require('./data/users.json');
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

  console.log(userLogin); //email and password

  //Gestionar login users
  const query = db.prepare('SELECT * FROM users');
  const userSelected = query.get(userLogin);

  const foundUser = usersData.find((eachUser) => {
    return (
      eachUser.email === userLogin.email &&
      eachUser.password === userLogin.password
    );
  });

  const responseSuccess = {
    success: true,
    userId: 'id_de_la_usuaria_encontrada',
  };

  const responseFail = {
    success: false,
    errorMessage: 'Usuaria/o no encontrada/o',
  };

  if (foundUser) {
    res.json(responseSuccess);
  } else {
    res.json(responseFail);
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
