const path = require('path');

module.exports = () => {
	/*bot.guilds.forEach(g => {
		bot.data.guilds[g.id] = {};

		bot.db.getGuild(g.id).then(res => {
			console.log(g.id);

			if (res[0]) bot.data.guilds[g.id] = res[0];
			else bot.db.insertGuild(g.id);

			console.log(bot.data.guilds[g.id]);
		});

		g.getInvites().then(guildInvites => {
			bot.data.guilds[g.id].invites = guildInvites;
		});
	});*/

	// Loading modules
	bot.settings.modules.forEach((module) => {
		const props = require(path.resolve(__dirname, '../', 'modules', module));

		bot.modules[module] = new props(bot);
		bot.modules[module].initModule();
	});

	bot.getGateway().then(gw => {
		bot.utils.log(`Connected to ${gw.url}.`, 'info');
	});

	bot.utils.log(`Ready !`, 'info');
};
