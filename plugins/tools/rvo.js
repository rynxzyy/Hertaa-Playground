module.exports = {
    command: ['rvo'],
    category: ['tools'],
    async run(m, { neko }) {
        if (!m.quoted) return m.reply('> reply read view once message-!!');
        let messages = m.quoted
        if (!messages.msg.viewOnce) return m.reply('> hmm, do you think that\'s rvo?');
        delete messages.msg.viewOnce
        neko.copyNForward(m.chat, messages, true, m);
    }
}