const undici = require('undici');
const { html } = require('js-beautify');
const { extension } = require('mime-types');

module.exports = {
    command: ['get', 'fetch'],
    category: ['tools'],
    async run(m, { neko, func, text }) {
        if (!text) return m.reply('> enter the url-!');
        const urls = isUrl(text);
        if (!urls) return m.reply('> invalid url-!');
        await m.react('🕐');
        
        for (const url of urls) {
            try {
                const response = await undici.fetch(url);
                if (!response.ok) return m.reply(`HTTP error! status: ${response.status}`);
                
                const mime = response.headers.get('content-type').split(';')[0];
                const cap = `*\`Fetch Url-!!\`*\n> *Request*: ${url}`;
                let body;
                
                if (/\html/gi.test(mime)) {
                    body = await response.text();
                    await neko.sendMessage(m.chat, {
                        document: Buffer.from(html(body)),
                        caption: cap,
                        fileName: 'result.html',
                        mimetype: mime,
                    }, { quoted: m });
                } else if (/\json/gi.test(mime)) {
                    body = await response.json();
                    m.reply(JSON.stringify(body, null, 2));
                } else if (/image|video|audio/gi.test(mime)) {
                    body = await response.arrayBuffer();
                    neko.sendFile(m.chat, Buffer.from(body), `result.${extension(mime)}`, cap, m, { mimetype: mime });
                } else {
                    body = await response.text();
                    m.reply(func.jsonFormat(body));
                }
            } catch (error) {
                console.error('Error fetching URL:', error);
                m.reply(`${error.message}`);
            }
        }
    },
};

function isUrl(string) {
    let urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g;
    let result = string.match(urlRegex);
    return result;
}
