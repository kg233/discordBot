const Image = require('../models/image');

async function getImageUrl() {
  let v = await Image.find();
  v = v.map(image => {
    return image.url;
  });
  return v;
}

module.exports = getImageUrl;
