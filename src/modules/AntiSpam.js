const ModuleBase = require("./Base");

class AntiSpam extends ModuleBase {
    constructor(bot) {
        super(bot);
    }

    initModule() {
        
    }

    getMessagePressure(msg, config) {
        let pressure = 0;
        const fixedPressure = config.MaxPressure - config.BasePressure
      
        pressure += config.BasePressure;
        pressure += (fixedPressure / 8000) * msg.content.length;
        pressure += (fixedPressure / 20) * (msg.mentions.length + msg.roleMentions.length);
        pressure += (fixedPressure / 6) * msg.attachments.length;
      
        return pressure;
    }
}

module.exports = AntiSpam;