module.exports = {
    command: ['self'],
    category: ['setting'],
    settings: {
        owner: true
    },
    async run(m, { text }) {
        if (text === 'on') {
            if (db.set.self) return m.reply('> self mode was already active before-!');
            db.set.self = true
            m.reply('> self mode successfully activated-!');
        } else if (text === 'off') {
            if (!db.set.self) return m.reply('> self mode was already disabled before-!');
            db.set.self = false
            m.reply('> self mode successfully disabled-!');
        } else {
            m.reply('> .self on/off ??');
        }
    },
};
