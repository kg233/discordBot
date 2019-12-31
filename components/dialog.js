function dialog(message) {
  message.channel
    .send('test', { code: true })
    .then(msg => {
      msg
        .react('🇦')
        .then(rct => {
          rct.message.react('🇧');
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
}

module.exports = dialog;
