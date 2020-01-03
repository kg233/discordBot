const { getImageUrl } = require('../queries/queries');

module.exports = function imagePick() {
  return getImageUrl()
    .then(url => {
      return url[Math.floor(Math.random() * url.length)];
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
