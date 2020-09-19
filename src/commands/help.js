exports.run = (msg) => {
	let cmds = new Array(3);
	for (let i = 0; i < cmds.length; i++) {cmds[i] = new Array()}

	for (const [cmd, conf] of Object.entries(bot.commands)) { 
		if (conf.hidden) continue;
		console.log(conf.type);
		cmds[conf.type - 1].push(`**${conf.label}** — ${conf.description}`)
	}

	bot.createMessage(msg.channel.id, {
		embed: {
			author: {
				name: bot.user.username + "'s commands",
				icon_url: bot.user.avatarURL
			},
			description: "**Do b!help <command> for command usage.**",
			fields: [
				{ name: "Core commands:", value: cmds[0].join("\n"), inline: false },
				//{ name: "Moderative commands:", value: cmds[1].join("\n"), inline: false },
				//{ name: "Utilities commands:", value: cmds[2].join("\n"), inline: false },
			],
			footer: {
				icon_url: msg.author.avatarURL,
				text: `${msg.author.username}#${msg.author.discriminator} (ID: ${msg.author.id})`
			},
			color: 0xFFFFFE,
			timestamp: new Date()
		}
	});
};

exports.name = 'help';

exports.conf = {
	aliases: [],
	description: 'Get all the commands or informations about a specific command.',
	devOnly: false,
	guildOnly: false,
	hidden: false,
	type: 1,
	usage: 'help [command]',
};
