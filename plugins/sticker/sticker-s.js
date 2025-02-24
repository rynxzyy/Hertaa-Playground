const axios = require('axios');

module.exports = {
    command: ['sticker', 'stick', 's'],
    category: ['sticker'],
    async run(m, { neko, text, quoted, mime }) {
        if (!/image|video|sticker/.test(quoted.type)) return m.reply('> reply with a photo/video that you want to make into a sticker-!');
		let media = await quoted.download()
		if (/image|webp/.test(mime)) {
            await m.react('🕐');
			if (text == 'meta') {
				await neko.sendAsSticker(m.chat, media, m, { packname: pack.name, author: pack.author, isAvatar: 1 })
			} else {
				await neko.sendAsSticker(m.chat, media, m, { packname: pack.name, author: pack.author })
			}
		} else if (/video/.test(mime)) {
			if ((quoted.msg || quoted).seconds > 11) return m.reply('> videos longer than 10 seconds cannot be used as stickers-!');
			await m.react('🕐');
			await neko.sendAsSticker(m.chat, media, m, { packname: pack.name, author: pack.author })
		} else {
			m.reply('> reply with a photo/video that you want to make into a sticker-!');
		}
    }
}