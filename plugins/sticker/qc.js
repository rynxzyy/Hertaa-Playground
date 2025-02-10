const axios = require('axios');

async function quotedLyo(teks, name, profile, reply, color = '#FFFFFF') {
	return new Promise(async (resolve, reject) => {
		const { quoted } = reply || {}
		const str = {
			type: 'quote',
			format: 'png',
			backgroundColor: color,
			width: 512,
			height: 768,
			scale: 2,
			messages: [
			    quoted,
			    {
				avatar: true,
				from: {
					id: 2,
					name,
					photo: {
						url: profile
					}
				},
				text: teks
			}]
		};
		try {
			const { data } = await axios.post('https://bot.lyo.su/quote/generate', JSON.stringify(str, null, 2), {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			resolve(data)
		} catch (e) {
			reject(e)
		}
	});
}

module.exports = {
    command: ['qc', 'quote'],
    category: ['sticker'],
    async run(m, { neko, text }) {
        if (!text) return m.reply('> enter the text-!')
    	await m.react('🕐');
    	const nn = await neko.getName(m.sender)
    	let pp = await neko.profilePictureUrl(m.sender, 'image').catch(() => 'https://i.pinimg.com/564x/8a/e9/e9/8ae9e92fa4e69967aa61bf2bda967b7b.jpg');
    	let gtww;
    	if (m.quoted) {
    	    const nq = await neko.getName(m.quoted.sender)
    	    let pq = await neko.profilePictureUrl(m.quoted.sender, 'image').catch(() => 'https://i.pinimg.com/564x/8a/e9/e9/8ae9e92fa4e69967aa61bf2bda967b7b.jpg');
    	    let uq = {
    			avatar: true,
    			from: {
    				id: 3,
    				name: nq,
    				photo: {
    					url: pq
    				}
    			},
    			text: m.quoted.msg
    		}
    		gtww = await quotedLyo(text, nn, pp, { quoted: uq })
    	} else {
    	    gtww = await quotedLyo(text, nn, pp)
    	}
        neko.sendAsSticker(m.chat, Buffer.from(gtww.result.image, 'base64'), m, { packname: pack.name, author: pack.author })
    }
}