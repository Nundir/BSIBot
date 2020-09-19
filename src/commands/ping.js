const request = require('superagent');

exports.run = (msg) => {
  const start = new Date();

  request('http://www.google.com', () => {
    const end = new Date();
    const resp = end.getTime() - start.getTime();

    bot.createMessage(msg.channel.id, {
      embed: {
        type: 'rich',
        author: {
          name: msg.author.username,
          icon_url: msg.author.avatarURL,
        },
        fields: [{
          name: 'Time of response',
          value: `${resp / (5 * 2)}ms`,
          inline: true,
        }],
        color: 0xFFFFFE,
      },
    });
  });
};

exports.name = 'ping';

exports.conf = {
  aliases: [],
  description: 'Pong.',
  devOnly: false,
  guildOnly: false,
  hidden: false,
  type: 1,
  usage: 'ping',
};
