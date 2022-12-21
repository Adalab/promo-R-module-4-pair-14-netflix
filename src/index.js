const express = require('express');
const cors = require('cors');
const moviesData = require('./data/movies.json');
// create and config server
const app = express();
app.use(cors());
app.use(express.json());

// init express aplication
const serverPort = 4000;
app.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

function asc(a, b) {
  if (a.title < b.title) {
    return -1;
  }
  if (a.title > b.title) {
    return 1;
  }
  return 0;
}

function desc(a, b) {
  if (a.title > b.title) {
    return -1;
  }
  if (a.title < b.title) {
    return 1;
  }
  return 0;
}

app.get('/movies', (req, res) => {
  const genderFilterParam = req.query.gender;
  const sortFilterParam = req.query.sort;

  const moviesDataFiltered = moviesData
    .filter((eachMovie) => {
      return eachMovie.gender.includes(genderFilterParam);
    })
    .sort(() => {
      if (sortFilterParam === 'asc') {
        return moviesData.sort(asc);
      } else if (sortFilterParam === 'desc') {
        return moviesData.sort(desc);
      } else {
        return true;
      }
    });

  //Refactor and make sort when filtering
  // const moviesDataSort = () => {
  //   if (sortFilterParam === 'asc') {
  //     return moviesDataFiltered.sort(asc);
  //   } else if (sortFilterParam === 'desc') {
  //     return moviesDataFiltered.sort(desc);
  //   } else {
  //     return true;
  //   }
  // };

  // const moviesDataSorted = moviesDataSort();
  console.log(moviesDataFiltered);

  res.json({
    success: true,
    movies: moviesDataFiltered,
  });
});

const staticServerPathWeb = 'src/public-react';
app.use(express.static(staticServerPathWeb));
