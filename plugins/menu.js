const pkg = require('../package.json');

module.exports = {
    command: ['menu', 'help'],
    category: ['main'],
    loading: true,
    async run(m, { neko, plugins, text, readmore }) {
        const menu = {};
        plugins.forEach((plugin) => {
            if (plugin.category && plugin.command) {
                plugin.category.forEach((cat) => {
                    if (!menu[cat]) {
                        menu[cat] = [];
                    }
                    menu[cat].push({ name: plugin.command[0] });
                });
            }
        });
        
        let totalCommands = 0;
        plugins.forEach(plugin => {
            if (plugin.command && Array.isArray(plugin.command)) {
                totalCommands += plugin.command.length;
            }
        });
        
        const generateCaption = (selectedCategory) => {
            let header = `Hii @${m.sender.split('@')[0]}-!!`;
            header += `\nHere are the feature options and a little information from ${botName}-!`;
            header += `\n\n> *NekoVersion!*: ${pkg.version}`;
            header += `\n> *Library*: ${pkg.dependencies['baileys'].replace('github:', '')}`;
            header += `\n> *Total Features*: ${totalCommands} Features-!!`;
            header += `\n> *Prefix*: [ ${m.prefix} ]`;
            header += `\n\n> _For Test Only-!!_`;
            header += `\n${readmore}`;

            let body = '';
            
            if (selectedCategory === 'all') {
                Object.entries(menu).forEach(([tag, commands]) => {
                    body += `\n┌  *Menu ${tag.capitalize()}-!!* \n${commands.map(cmd => `│  ${m.prefix + cmd.name}`).join('\n')}\n└\n`;
                });
                body += `\n> ${footertxt}`;
            } else if (menu[selectedCategory]) {
                body = `\n┌  *Menu ${selectedCategory.capitalize()}-!!* \n${menu[selectedCategory].map(cmd => `│  ${m.prefix + cmd.name}`).join('\n')}\n└\n`;
                body += `\n> ${footertxt}`;
            } else {
                const listCategories = Object.keys(menu);
                body = `\n┌  *List Menu-!!* \n│  ${m.prefix}menu all\n${listCategories.map(cat => `│  ${m.prefix}menu ${cat}`).join('\n')}\n└\n`;
                body += `\n> ${footertxt}`;
            }
            
            return header + body;
        };
        
        const caption = generateCaption(text);
        neko.sendDocs(m.chat, caption, m);
    },
};