var now = require("performance-now")

exports.run = (msg, args) => {
	const clean = text => {
		if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
		else return text;
	}

	args = args.join(' ');

	try {
		var t0 = now();
		let evaled = eval(args)
		var t1 = now();

		if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

		bot.createMessage(msg.channel.id, {
			embed: {
				description: `${clean(evaled)}`,
				footer: {
					text: `${((t1-t0)).toFixed(4)}ms`
				},
				color: 0xE7A727
			}
		});
	} catch (err) {
		bot.createMessage(msg.channel.id, `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
	}
};

exports.name = 'eval';

exports.conf = {
  aliases: [],
  description: 'Execute a chunk of code.',
  permissionMessage: "Error: This is a developer only command.",
  requirements: {
	userIDs: bot.settings.developers
  },
  guildOnly: false,
  hidden: true,
  type: 1,
  usage: 'eval <code>',
};
