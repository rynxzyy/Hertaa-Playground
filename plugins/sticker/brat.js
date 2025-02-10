const axios = require('axios');

module.exports = {
    command: ['brat', 'stickbrat'],
    category: ['sticker'],
    async run(m, { neko, text }) {
        if (!text) return m.reply('> enter the text-!!')
        await m.react('🕐');
        let { data } = await axios.get(`https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' })
        neko.sendAsSticker(m.chat, data, m, { packname: pack.name, author: pack.author })
    }
}