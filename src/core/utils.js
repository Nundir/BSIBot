"use strict";

const colog = require('colog');

/**
 * Represent a color with a log type
 */
const colors = {
  debug: 'magenta',
  error: 'red',
  warn: 'yellow',
  info: 'green',
};

/**
 * Log message to terminal with color and options
 * @param {string} message
 * @param {string} type
 */
const log = (message, args) => {
  let type = args;

  if (!args) type = 'info';

  const color = colors[type];
  const today = new Date();
  const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

  colog.log(colog.color(`[Shard 1/${bot.shards.size != 0 ? bot.shards.size : 1}]`, 'magenta') + colog.color(`[${date} ${time}]`, 'yellow') + colog.color(`[${type}]: ${message}`, color));
};

/**
 * Send an error to a channel
 * @param {string} message
 * @param {string} error
 */
const sendError = (message, error) => {
  if (error) bot.createMessage(message.channel.id, error);
};

/**
 * Get a random int value between two values
 * @param {Int} min
 * @param {Int} max
 * @returns {Int}
 */
const random = (min, max) => Math.random() * (max - min) + min;

/**
 * Check if a guild was already added to cache data
 * @param {String} id
 */
const checkGuild = (id) => {
  if (bot.data.guilds[id] && ('config' in bot.data.guilds[id])) return;

  bot.data.guilds[id] = {};
  bot.data.guilds[id].config = {};
  bot.data.guilds[id].modules = ['spam'];
};

const format = (msg, options) => {
  let res = msg;

  if (options.guild) {
    res = res.replace('%serverName%', options.guild.name);
    res = res.replace('%serverId%', options.guild.id);
    res = res.replace('%memberCount%', options.guild.memberCount);
  }

  if (options.member) {
    res = res.replace('%memberName%', options.member.username);
    res = res.replace('%memberDisc%', options.member.discriminator);
    res = res.replace('%memberId%', options.member.id);
    res = res.replace('%member%', options.member.mention);
  }

  return res;
};

module.exports = {
  log,
  sendError,
  random,
  checkGuild,
  format,
};
