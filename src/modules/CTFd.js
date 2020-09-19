const request = require('then-request');
const path = require('path');
const fs = require('fs');
const ModuleBase = require("./Base");

/**
 * Shitty code because I'm too lazy to deal with the async/await
 * @param {int} ms 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Module for CTFd's updates
 * @extends ModuleBase
 */
class CTFd extends ModuleBase {
    /**
     * Constructor of the module
     * @param {CommandClient} bot 
     */
    constructor(bot) {
        super(bot);
        this.settings = bot.settings.modules_settings.CTFd;

        this.localdata = {"timestamp": "0", "users": {}}
    }

    /**
     * Function called when the bot is ready
     */
    initModule() {
        var _this = this;

        this.loadState();
        
        setInterval(async function () {
            bot.utils.log("Checking CTFd...", "info")

            _this.checkScoreboard(_this.localdata);

            await sleep(5000);

            console.log(4);

            // Get actual timestamp
            _this.localdata.timestamp = Date.now()

            // Backup the state in a file to avoid double notifications but get all of them
            _this.saveState();
        }, "30000");
    }

    /**
     * Check the scoreboard of the CTFd instance to check if a user got new points.
     */
    checkScoreboard() {
        request('GEt', `${this.settings.url}/api/v1/scoreboard`, {
            headers: {
                "Authorization": `Token ${this.settings["api-token"]}`,
                "Content-Type": "application/json",
            },
        }).getBody('utf8').then(JSON.parse).then(async body => {

            if (!body.success) return bot.utils.log("[CTFd] API returned an error : " + JSON.stringify(body));
            
            let updated_user = []

            for (const user of body.data) {
                // Check if the user is new or if his global score changed
                if (!this.localdata.users[user.account_id] || this.localdata.users[user.account_id].score != user.score) {
                    this.checkUser(user);
                    updated_user.push(user);
                }
            }

            // Return body to the next then
            return updated_user;
        }).then(async updated_user => {
            await sleep(4000)

            console.log(2)

            for (const user of updated_user) {
                console.log(3);
                // Update the local data of the users
                this.localdata.users[user.account_id] = { "pos": user.pos, "score": user.score }
            }
        });
    }

    /**
     * Check the new solves of a specific user
     * @param {Object} user 
     */
    checkUser(user) {
        request('GET', `${this.settings.url}/api/v1/users/${user.account_id}/solves`, {
            headers: {
                "Authorization": `Token ${this.settings["api-token"]}`,
                "Content-Type": "application/json",
            },
        }).getBody('utf8').then(JSON.parse).then(body => {
            if (!body.success) return bot.utils.log("[CTFd] API returned an error : " + JSON.stringify(body));

            for (const solve of body.data) {                
                if (new Date(solve.date) >= new Date(this.localdata.timestamp)) {
                    this.sendNotification(user, solve);
                }
            }

            // Return body to the next then
            return body;
        }).then(body => {
            console.log("1")
        });
    }

    /**
     * Send a message to the discord channel for a solve
     * @param {Object} user 
     * @param {Object} solve 
     */
    sendNotification(user, solve) {
        let challenge_url = `${this.settings.url}/challenges#${solve.challenge.name}-${solve.challenge_id}`;
        challenge_url = challenge_url.split(" ").join("%20");

        bot.createMessage(this.settings["log-channel"], {
            embed: {
                type: 'rich',
                author: {
                    name: "Challenge résolu",
                    icon_url: bot.user.avatarURL
                },
                description: `[${user.name}](${this.settings.url}${user.account_url}) à résolu le challenge [${solve.challenge.name}](${challenge_url}).`,
                fields: [
                    {
                        "name": "Score total",
                        "value": `${user.score} (+${solve.challenge.value} pts)`,
                        inline: true,
                    },
                    {
                        "name": "Classement",
                        "value": `${user.pos}${user.pos == 1 ? "er" : "ème"} ${user.pos < this.localdata.users[user.account_id].pos ? "(<:scoreboard_up:756518779562885220>)" : (user.pos > this.localdata.users[user.account_id].pos ? "(<:scoreboard_down:756518779575468113>)" : "")}`,
                        inline: true,
                    }
                ],
                "footer": {
                    "text": new Date(solve.date).toUTCString()
                },
                color: 0xFFFFFE,
            }
        })

        // Replace the old data
        bot.utils.log(`${user.name} solved ${solve.challenge.name} at ${new Date(solve.date).getTime()}.`);
    }

    /**
     * Load the last CTFd data saved (Useful if the bot is offline more than 30 seconds to process what happened during this time)
     */
    loadState() {
        this.localdata = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'CTFd.json')));
    }

    /**
     * Save the actual CTFd data (Useful if the bot is offline more than 30 seconds to process what happened during this time)
     */
    saveState() {
        fs.writeFileSync(path.resolve(__dirname, '..', 'data', 'CTFd.json'), JSON.stringify(this.localdata, null, 2));
    }
}

module.exports = CTFd;