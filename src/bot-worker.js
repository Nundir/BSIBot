const Eris = require('eris');
const fs = require('fs');
const path = require('path');
const settings = require('./core/settings.json');

global.bot = new Eris.CommandClient(
	settings.token,
	settings.clientOptions,
	settings.commandOptions,
);

bot.settings = settings;
bot.utils = require('./core/utils');
bot.db = require('./core/db');
bot.locales = {};
bot.modules = {};

// Global data & config loading
bot.data = { guilds: {}, users: {}, default: require('./data/default.json') };

/*
* Languages loading & support
*/
fs.readdir(path.resolve(__dirname, 'locales'), (err, files) => {
	if (err) bot.utils.log(err, 'error');

	bot.utils.log(`Loading ${files.length} languages.`, 'debug');

	// Loading all locales
	files.forEach((f) => {
		const props = require(path.resolve(__dirname, 'locales', f));
		bot.utils.log(`Loading language: ${f.split('.')[0]}.`, 'debug');

		// Saving the language in an object
		bot.locales[f.split('.')[0]] = props;
	});
});

/*
* Commands & atlas loading
*/
fs.readdir(path.resolve(__dirname, 'commands'), (err, files) => {
	if (err) bot.utils.log(err, 'error');

	bot.utils.log(`Loading ${files.length} commands.`, 'debug');

	// Loading all commands
	files.forEach((f) => {
		const props = require(path.resolve(__dirname, 'commands', f));
		bot.utils.log(`Loading command: ${props.name}.`, 'debug');

		// Adding the command to the CommandClient
		bot.registerCommand(props.name, props.run, props.conf);
		// Saving the type of the command for help command
		bot.commands[props.name].type = props.conf.type;

		// [TODO] Adding commands alias
	});
});

// Loading events
bot.utils.log(`Loading events.`, 'debug');
require('./core/events')(bot);

// Initializing bot configuration module
bot._ = (guild, key) => {
	let lang = bot.db.getConfig(guild.id, "_lang");

	if (!(key in bot.locales[lang])) {
		lang = bot.settings.defaultLang;

		if (!(key in bot.locales[lang])) {
			bot.utils.log(`LOCALE_KEY_ERROR: ${key} doesn't exist.`, 'error');
		return;
		}
	}

	return bot.locales[lang][key];
};

process.on('unhandledRejection', (err) => {
	if (err.stack.indexOf("ReqlOpFailedError") > -1) return;
	bot.utils.log(`Uncaught Promise Error: \n ${err.stack}`, 'error');
});

// Bot starting
bot.connect();