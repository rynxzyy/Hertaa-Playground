const chalk = require('chalk');

module.exports = (m) => {
    console.log('\x1b[30m--------------------\x1b[0m');
    console.log(chalk.bgHex('#e74c3c').bold(` New Message!! `));
    console.log(
        `   - Tanggal: ${new Date().toLocaleString('id-ID')} WIB \n` +
        `   - Pesan: ${m.body || m.type} \n` +
        `   - Pengirim: ${m.pushName} \n` +
        `   - JID: ${m.sender}`
    );
    if (m.isGroup) {
        console.log(
            `   - Grup: ${m.metadata.subject} \n` +
            `   - GroupJid: ${m.chat}`
        );
    }
};
