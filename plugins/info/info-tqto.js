module.exports = {
    command: ['tqto', 'credits'],
    category: ['info'],
    loading: true,
    async run(m, { neko }) {
        let cap = '*`Special Thanks To:`*\n';
        cap += `> *Bang_syaii*\n`;
        cap += `> Role: Bot Script & Scraper Creator\n`;
        cap += `> Telegram: https://t.me/this_syaii\n`;
        cap += `> *AxellNetwork*\n`;
        cap += `> Role: Bot Script & Scraper Developer\n`;
        cap += `> GitHub: https://github.com/AxellNetwork\n\n`;
        cap += '*`Forum & Community`*\n';
        cap += `> Update Forum: https://whatsapp.com/channel/0029VauJgduEwEjwwVwLnw37\n`;
        cap += `> Join Group: https://chat.whatsapp.com/BsZHPiZoisT5GdVgiEufJK`;
        
        neko.sendDocs(m.chat, cap, m);
    },
};
