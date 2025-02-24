const pkg = require('../../package.json');

module.exports = {
    command: ['menu', 'help'],
    category: ['info'],
    loading: true,
    async run(m, { neko, plugins, text, fkontak }) {
        const menu = {};
        let totalMainCommands = 0;

        plugins.forEach((plugin) => {
            if (plugin.category && plugin.command) {
                plugin.category.forEach((cat) => {
                    if (!menu[cat]) {
                        menu[cat] = [];
                    }
                    menu[cat].push({ name: plugin.command[0], aliases: plugin.command });
                });
            }
            if (plugin.command && Array.isArray(plugin.command)) {
                totalMainCommands++;
            }
        });

        let showAliases = false;
        let selectedCategory = text.toLowerCase().replace('--alias', '').trim();

        if (text.includes('--alias')) {
            showAliases = true;
        }

        const generateCaption = (selectedCategory) => {
            let header = `Heyy @${m.sender.split('@')[0]}-!!`;
            header += `\nGo ahead and pick something from the ${menu[selectedCategory] ? 'feature' : 'menu'} beloww-!\n`;

            let body = '';

            if (menu[selectedCategory]) {
                const totalFeatures = menu[selectedCategory].length;

                if (showAliases) {
                    body = `\n*\`"${selectedCategory.capitalize()}" Features-!!\`*\n`;
                    body += menu[selectedCategory].map(cmd => `> ${cmd.aliases.map(a => m.prefix + a).join(' / ')}`).join('\n');
                } else {
                    body = `\n*\`"${selectedCategory.capitalize()}" Features-!!\`* \n${menu[selectedCategory].map(cmd => `> ${m.prefix + cmd.name}`).join('\n')}`;
                }

                body += `\n\n> Total Features: ${totalFeatures}`;
            } else {
                const listCategories = Object.keys(menu);
                body = `\n*\`List Menu-!!\`* \n${listCategories.map(cat => `> ${m.prefix}menu ${cat} (${menu[cat].length})`).join('\n')}`;
                body += `\n\n> Total Features: ${totalMainCommands}`;
            }
            body += `\n> ${footertxt}`;

            return header + body;
        };

        const caption = generateCaption(selectedCategory);
        neko.sendDocs(m.chat, caption, fkontak);
    },
};
