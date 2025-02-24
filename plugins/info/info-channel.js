module.exports = {
    command: ['chinfo', 'channelinfo', 'ci'],
    category: ['info'],
    async run(m, { neko, func, text }) {
        if (!text || !func.isUrl(text) || !/whatsapp.com\/channel/.test(text)) return m.reply('> enter channel link to see channel info-!');
        try {
            await m.react('🕐');
            let id = text.replace(/https:\/\/(www\.)?whatsapp\.com\/channel\//, '').split('/')[0];
            let metadata = await neko.newsletterMetadata('invite', id);
            if (!metadata) return m.reply('> *failed to retrieve channel metadata.*\n> make sure the provided link is correct-!');
            
            let cap = '*`WhatsApp Channel Information-!!`*\n';
            cap += `> *Channel ID*: ${metadata.id}\n`;
            cap += `> *Channel Name*: ${metadata.name}\n`;
            cap += `> *Followers*: ${func.h2k(metadata.subscribers)}\n`;
            cap += `> *Created On*: ${new Date(metadata.creation_time * 1000).toLocaleString('en-US')}\n`;
            
            if (metadata.preview) {
                m.reply({ image: { url: 'https://pps.whatsapp.net' + metadata.preview }, caption: cap });
            } else {
                m.reply(cap);
            }
        } catch (error) {
            console.error('Error:', error);
            m.reply(mess.err);
        }
    },
};
