const get = (key, defaultData) => {
  const data = localStorage.getItem(key);
  if (data === null) {
    return defaultData;
  } else {
    return JSON.parse(data);
  }
};

const set = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const clear = () => {
  localStorage.clear();
};

const objToExport = {
  get: get,
  set: set,
  clear: clear,
};

export default objToExport;
