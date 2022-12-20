// login
//'//beta.adalab.es/curso-intensivo-fullstack-recursos/apis/netflix-v1/empty.json'
const getMoviesFromApi = () => {
  console.log('Se están pidiendo las películas de la app');
  return fetch('http://localhost:4000/movies', { method: 'GET' })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    });
};

const objToExport = {
  getMoviesFromApi: getMoviesFromApi,
};

export default objToExport;
