const r = require('rethinkdbdash')(bot.settings.rethinkdb_settings);

// GUILDS FUNCTIONS
const getGuild = id => r.table('guilds').filter(r.row('id').eq(id)).run();
const insertGuildCustom = value => r.table('guilds').insert(value).run();
const insertGuild = id => r.table('guilds').insert({ id, config: {}, modules: [] }).run();
const updateGuildCustom = (id, update) => r.table('guilds').filter(r.row('id').eq(id)).update(update).run();
const updateGuild = (id, key, value) => r.table('guilds').filter(r.row('id').eq(id)).update({ [key]: value }).run();

// USERS FUNCTIONS
const getUser = id => r.table('users').filter(r.row('id').eq(id)).run();
const insertUserCustom = value => r.table('users').insert(value).run();
const insertUser = id => r.table('users').insert({ id, xp: 0 }).run();
const updateUserCustom = (id, update) => r.table('users').filter(r.row('id').eq(id)).update(update).run();
const updateUser  = (id, key, value) => r.table('users').filter(r.row('id').eq(id)).update({ [key]: value }).run();

// CONFIG FUNCTIONS
const setConfig = (id, key, value, private) => {
  if (!(key in bot.data.default.config) || (!private && key.startsWith('_'))) return 'ERROR_UNKNOWN_KEY';
  if (!(id in bot.data.guilds) || !('config' in bot.data.guilds[id])) bot.utils.checkGuild(id);

  bot.data.guilds[id].config[key] = value;
  r.table('guilds').filter(r.row('id').eq(id)).update({ config: { [key]: value} }).run();

  return true;
};

const getConfig = (id, key) => {
  if (!(id in bot.data.guilds) || !('config' in bot.data.guilds[id])) bot.utils.checkGuild(id);

  return key in bot.data.guilds[id].config
    ? bot.data.guilds[id].config[key]
    : bot.data.default.config[key];
};

// MODULES FUNCTIONS
const setModule = (id, key, state) => {
  if (!bot.data.default.modules.includes(key)) return 'ERROR_UNKNOWN_MODULE';
  if (!(id in bot.data.guilds) || !('config' in bot.data.guilds[id])) bot.utils.checkGuild(id);

  if (state) {
    if (bot.data.guilds[id].modules.includes(key)) return 'ERROR_MODULE_ALREADY_ENABLED';

    bot.data.guilds[id].modules.push(key);
    updateGuild(id, 'modules', bot.data.guilds[id].modules);
  } else {
    if (!bot.data.guilds[id].modules.includes(key)) return 'ERROR_MODULE_ALREADY_DISABLED';

    bot.data.guilds[id].modules.splice(bot.data.guilds[id].modules.indexOf(key), 1);
    updateGuild(id, 'modules', bot.data.guilds[id].modules);
  }

  return true;
};

const getModule = (id, key) => {
  if (!(id in bot.data.guilds) || !('config' in bot.data.guilds[id])) return false;

  return bot.data.guilds[id].modules.includes(key);
};

module.exports = {
  r,
  getGuild,
  insertGuildCustom,
  insertGuild,
  updateGuildCustom,
  updateGuild,

  getUser,
  insertUserCustom,
  insertUser,
  updateUserCustom,
  updateUser,

  setConfig,
  getConfig,
  setModule,
  getModule,
};
