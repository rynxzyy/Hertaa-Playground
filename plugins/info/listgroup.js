module.exports = {
    command: ['listgc', 'gcl'],
    category: ['info'],
    settings: {
        owner: true
    },
    loading: true,
    async run(m, { neko, func, store }) {
        let data = Object.values(store.groupMetadata);
        if (data.length === 0) return m.reply('> *There are no groups registered on this bot.*');
        
        let cap = '*`Bot Group List-!!`*\n';
        cap += `> *Total Groups:* ${data.length}\n\n`;
    
        cap += data.sort((a, b) => b.creation - a.creation).map((a, i) => {
            let owner = a.owner ? '@' + a.owner.split('@')[0] : 'Tidak ada pemilik';
            return (
              `> *${i + 1}.* ${a.subject}\n` +
              `> *Created*: ${func.ago(a.creation * 1000)}\n` +
              `> *Member Count*: ${a.size}\n` +
              `> *Owner*: ${owner}`
            );
        }).join('\n\n');
        
        neko.sendDocs(m.chat, cap, m);
    },
};
