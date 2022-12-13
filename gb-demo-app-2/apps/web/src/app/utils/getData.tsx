import memoize from 'lodash.memoize';

const getData = (api: string) =>
  new Promise((resolve) => {
    fetch(api)
      .then((response) => response.json())
      .then((data) => resolve(data));
  });

export default memoize(getData);
