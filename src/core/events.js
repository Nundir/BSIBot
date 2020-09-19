const path = require('path');

const reqEvent = event => require(path.join('../events', event));

module.exports = (bot) => {
  bot.on('ready', reqEvent('ready'));
  bot.on('messageCreate', reqEvent('messageCreate'));
};
