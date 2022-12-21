// login
//'//beta.adalab.es/curso-intensivo-fullstack-recursos/apis/netflix-v1/empty.json'
const getMoviesFromApi = (filters) => {
  console.log('Se están pidiendo las películas de la app');
  console.log(filters);
  const queryParams = `?gender=${filters.gender}&sort=${filters.sort}`;
  return fetch('http://localhost:4000/movies' + queryParams, { method: 'GET' })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

const objToExport = {
  getMoviesFromApi: getMoviesFromApi,
};

export default objToExport;
