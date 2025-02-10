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
        cap += `> GitHub: https://github.com/AxellNetwork\n`;
        cap += `> *Script Users*\n`;
        cap += `> All of you who have supported and used this script!\n\n`;
        cap += '*`Acknowledgement`*\n';
        cap += `Thank you for using this script. We hope it will be useful for you, whether you use it or not.\n\n`;
        cap += '*`Support Our Other Projects:`*\n';
        cap += `https://github.com/AxellNetwork\n\n`;
        cap += '*`Forum & Community`*\n';
        cap += `> Update Forum: https://whatsapp.com/channel/0029VauJgduEwEjwwVwLnw37\n`;
        cap += `> Join Group: https://chat.whatsapp.com/BsZHPiZoisT5GdVgiEufJK`;
        
        neko.sendDocs(m.chat, cap, m);
    },
};
