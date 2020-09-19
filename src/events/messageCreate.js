module.exports = (msg) => {
  if (msg.author.bot) return;

  bot.utils.log(`${msg.author.username}#${msg.author.discriminator}: ${msg.content}`);
};
