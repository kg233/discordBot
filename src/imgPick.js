const getImageUrl = require('../queries/queries');

const Image = require('../models/image');

const source = [
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1578268426&di=ec37d5a4040a1d753d4b054423c17600&imgtype=jpg&er=1&src=http%3A%2F%2Fwww.gaoxiaogif.com%2Fd%2Ffile%2F20160303%2Fa689c0af8faedd196e6c9a4b759cd19f.jpg',
];

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
