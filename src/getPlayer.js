const Player = require('../components/player');

//message is this bot's loading message, we will edit it to playing when we actually play the music
// member var is the member of the guild that initiated the command, we will join their voice channel
module.exports = function getPlayer(message, member) {
  return member.voiceChannel.join().then(connection => {
    return new Player(message, connection);
  });
};
