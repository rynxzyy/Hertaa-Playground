const axios = require('axios');

module.exports = {
    command: ['sc', 'scbot'],
    category: ['info'],
    loading: true,
    async run(m, { neko, func }) {
        let { data } = await axios.get('https://api.github.com/repos/AxellNetwork/NekoBot')
        
        let cap = '*`Script Information-!!`*\n';
        cap += `> *Name*: ${data.name}\n`;
        cap += `> *Owner*: ${data.owner.login}\n`;
        cap += `> *Stars*: ${data.stargazers_count}\n`;
        cap += `> *Forks*: ${data.forks}\n`;
        cap += `> *Created*: ${func.ago(data.created_at)}\n`;
        cap += `> *Last Updated*: ${func.ago(data.updated_at)}\n`;
        cap += `> *Last Published*: ${func.ago(data.pushed_at)}\n`;
        cap += `> *Repository Link*: ${data.html_url}`;
        
        neko.sendDocs(m.chat, cap, m);
    },
};
