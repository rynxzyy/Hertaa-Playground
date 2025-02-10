const fs = require('node:fs');
const jsBeautify = require('js-beautify');

module.exports = {
    command: ['scrape', 'scraper'],
    category: ['owner'],
    settings: {
        owner: true,
    },
    async run(m, { neko, text }) {
        let src = await scraper.list();
        
        const idk = `*\`Command Usage Guide-!!\`*
> 1. Use *\`--get\`* to retrieve a scraper
> 2. Use *\`--add\`* to add a new scraper
> 3. Use *\`--delete\`* to delete a scraper

*\`Available Scraper List\`*:
${Object.keys(src).map((a, i) => `> *${i + 1}.* ${a}`).join('\n')}`;
        
        if (!text) return neko.sendDocs(m.chat, idk, m);
        
        if (text.includes('--get')) {
            let input = text.replace('--get', '').trim();
            if (!input) return m.reply(`> please provide the scraper name or number.`);
            
            let list = Object.keys(src);
            let file = isNaN(input) ? `${scraper.dir}/${input}.js` : `${scraper.dir}/${list[parseInt(input) - 1]}.js`;
            
            try {
                m.reply(fs.readFileSync(file.trim()).toString());
            } catch (e) {
                m.reply(`> scraper ${input} not found.`);
            }
        } else if (text.includes('--add')) {
            if (!m.quoted || !m.quoted.body) return m.reply(`> please reply to the message containing the scraper code.`);
            
            let input = text.replace('--add', '').trim();
            if (!input) return m.reply(`> please provide a name for the new scraper.`);
            
            try {
                let file = `${scraper.dir}/${input}.js`;
                fs.writeFileSync(file.trim(), jsBeautify(m.quoted.body));
                m.reply(`> scraper ${input} successfully added!`);
            } catch (e) {
                m.reply(`> an error occurred while adding the scraper.`);
            }
        } else if (text.includes('--delete')) {
            let input = text.replace('--delete', '').trim();
            if (!input) return m.reply(`> please provide the scraper name or number to delete.`);
            
            let list = Object.keys(src);
            let file = isNaN(input) ? `${scraper.dir}/${input}.js` : `${scraper.dir}/${list[parseInt(input) - 1]}.js`;
            
            try {
                fs.unlinkSync(file.trim());
                m.reply(`> scraper ${input} successfully deleted!`);
            } catch (e) {
                m.reply(`> scraper ${input} not found.`);
            }
        } else {
            neko.sendDocs(m.chat, idk, m);
        }
    },
};