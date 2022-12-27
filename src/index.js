const express = require('express');
const cors = require('cors');
// const moviesData = require('./data/movies.json');
const usersData = require('./data/users.json');
const Database = require('better-sqlite3');

//Create database
const db = new Database('./src/db/database.db', { verbose: console.log });

// create and config server
const app = express();
app.use(cors());
app.use(express.json());

// init express aplication
const serverPort = 4000;
app.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//inicializar motor de plantillas
app.set('view engine', 'ejs');

function asc(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

function desc(a, b) {
  if (a.name > b.name) {
    return -1;
  }
  if (a.name < b.name) {
    return 1;
  }
  return 0;
}

app.get('/movies', (req, res) => {
  const genderFilterParam = req.query.gender;
  const sortFilterParam = req.query.sort;

  // const moviesDataSort = () => {
  //   if (sortFilterParam === 'asc') {
  //     return moviesList.sort(asc);
  //   } else if (sortFilterParam === 'desc') {
  //     return moviesList.sort(desc);
  //   } else {
  //     return true;
  //   }
  // };

  if (genderFilterParam) {
    const query = db.prepare('SELECT * FROM Movies WHERE gender = ?');
    const moviesList = query.all(genderFilterParam);
    const moviesFiltered = moviesList.sort(() => {
      if (sortFilterParam === 'asc') {
        return moviesList.sort(asc);
      } else if (sortFilterParam === 'desc') {
        return moviesList.sort(desc);
      } else {
        return true;
      }
    });
    res.json({
      success: true,
      movies: moviesFiltered,
    });
  } else {
    const query = db.prepare('SELECT * FROM Movies');
    const moviesList = query.all();
    res.json({
      success: true,
      movies: moviesList,
    });
  }

  // const moviesDataFiltered = moviesList.filter((eachMovie) => {
  //   return eachMovie.gender.includes(genderFilterParam);
  // });

  //Refactor and make sort when filtering

  // const moviesDataSorted = moviesDataSort();

  // res.json({
  //   success: true,
  //   movies: moviesList,
  // });
});

app.post('/users', (req, res) => {
  const userLogin = req.body;
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
  const foundMovie = moviesData.find((eachMovie) => {
    return eachMovie.id === movieId;
  });
  res.render('movie', foundMovie);
});

//servidores estaticos
const staticServerPathWeb = 'src/public-react';
app.use(express.static(staticServerPathWeb));

const staticServerPathWeb2 = 'src/public-movies-images';
app.use(express.static(staticServerPathWeb2));

const staticServerPathWeb3 = 'src/public-css';
app.use(express.static(staticServerPathWeb3));
