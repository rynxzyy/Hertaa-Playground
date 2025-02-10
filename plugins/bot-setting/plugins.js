const fs = require('fs');
const jsBeautify = require('js-beautify');

module.exports = {
    command: ['plugin', 'plugins'],
    category: ['owner'],
    settings: {
        owner: true,
    },
    async run(m, { neko, text }) {
        let src = plug.plugins;
        
        const idk = 
`*\`Command Usage Guide-!!\`*
> 1. Use *\`--get\`* to retrieve a plugin
> 2. Use *\`--add\`* to add a new plugin
> 3. Use *\`--delete\`* to delete a plugin

*\`Available Plugin List\`*:
${Object.keys(src).map((a, i) => `> *${i + 1}.* ${a.split('plugins/')[1]}`).join('\n')}`
        
        if (!text) return neko.sendDocs(m.chat, idk, m);
    
        if (text.includes('--get')) {
            let input = text.replace('--get', '').trim();
            if (!input) return m.reply(`> please select a plugin by including the plugin number or name.`);
            
            let list = Object.keys(src).map((a) => a.split('plugins/')[1]);
            let file = isNaN(input) ? `${plug.directory}/${input}` : `${plug.directory}/${list[parseInt(input) - 1]}`;
            
            try {
                m.reply(fs.readFileSync(file.trim()).toString());
            } catch (e) {
                m.reply( `> plugin ${input} not found.`);
            }
        } else if (text.includes('--add')) {
            if (!m.quoted || !m.quoted.body) return m.reply(`> please reply to the message containing the plugin code you want to save.`);
            
            let input = text.replace('--add', '').trim();
            if (!input) return m.reply(`> enter the name of the plugin you want to add.`);
    
            try {
                let file = `${plug.directory}/${input}`;
                fs.writeFileSync(file.trim(), jsBeautify(m.quoted.body));
                m.reply(`> plugin ${input} successfully saved!`);
            } catch (e) {
                m.reply(`> an error occurred while saving the plugin.`);
            }
        } else if (text.includes('--delete')) {
            let input = text.replace('--delete', '').trim();
            if (!input) return m.reply(`> please enter the name or number of the plugin you want to delete.`);
            
            let list = Object.keys(src).map((a) => a.split('plugins/')[1]);
            let file = isNaN(input) ? `${plug.directory}/${input}` : `${plug.directory}/${list[parseInt(input) - 1]}`;
            
            try {
                fs.unlinkSync(file.trim());
                m.reply(`> plugin ${input} successfully removed from plugin list.`);
            } catch (e) {
                m.reply(`> plugin ${input} not found.`);
            }
        } else {
            neko.sendDocs(m.chat, idk, m);
        }
    },
};
