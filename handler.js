process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)
require('./settings.js');
const func = require('./lib/function.js');
const chalk = require('chalk');
const fs = require('node:fs');
const { LoadDataBase } = require('./lib/utilities/loadData');

module.exports = async (m, neko, store) => {
    await LoadDataBase(neko, m);
    
    if (m.isBot) return
    if (db.set.self && !m.isOwner) return;
    if (m.isGroup && db.groups[m.chat]?.mute && !m.isOwner) return;

    if (Object.keys(store.groupMetadata).length === 0) {
        store.groupMetadata = await neko.groupFetchAllParticipating();
    }
    
    if (db.set.read && m.message && m.key.remoteJid !== 'status@broadcast') {
        neko.readMessages([m.key]);
    }

    const scrape = await scraper.list();
    const usedPrefix = prefix.includes(m.prefix);
    const text = m.text;
    const isCmd = m.prefix && usedPrefix;
    const quoted = m.quoted ? m.quoted : m
    const mime = (quoted.msg || quoted).mimetype || ''
    const more = String.fromCharCode(8206)
	const readmore = more.repeat(999)

    for (let name in plug.plugins) {
        let plugin;
        if (typeof plug.plugins[name].run === 'function') {
            let anu = plug.plugins[name];
            plugin = anu.run;
            for (let prop in anu) {
                if (prop !== 'code') {
                    plugin[prop] = anu[prop];
                }
            }
        } else {
            plugin = plug.plugins[name];
        }
        if (!plugin) return;
        const gtwww = {
            neko,
            text,
            plugins: Object.values(plug.plugins).filter((a) => a.command),
            func,
            scrape,
            store,
            readmore,
            quoted,
            mime
        };
        try {
            if (typeof plugin.events === 'function') {
                if (plugin.events(m, gtwww)) 
                continue;
            }
            const cmd = usedPrefix ? plugin?.command?.includes(m.command.toLowerCase()) : '';
            if (cmd) {
                if (db.set.typing) await neko.sendPresenceUpdate('composing', m.chat)
                if (plugin.loading) {
                    m.react('🕐');
                }
                if (plugin?.settings?.owner && !m.isOwner) {
                    return m.reply(mess.owner);
                }
                if (plugin?.settings?.group && !m.isGroup) {
                    return m.reply(mess.group);
                }
                if (plugin?.settings?.admin && !m.isAdmin) {
                    return m.reply(mess.admin);
                }
                if (plugin?.settings?.botAdmin && !m.isBotAdmin) {
                    return m.reply(mess.botAdmin);
                }
                await plugin(m, gtwww)
            }
        } catch (error) {
            if (error.name) {
                for (let own of owner) {
                    let jid = await neko.onWhatsApp(own + '@s.whatsapp.net');
                    if (!jid[0].exists) continue;
                    let caption = '*Error Detected-!!*\n'
                    caption += `> *Command name:* ${m.command}\n`
                    caption += `> *File Location:* ${name}`
                    caption += `\n\n${func.jsonFormat(error)}`
                    neko.sendMessage(own + '@s.whatsapp.net', { text: caption })
                }
                m.reply(func.jsonFormat(error));
            } else {
                m.reply(func.jsonFormat(error));
            }
        }
    }
};

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.bgHex('#e74c3c').bold(` Update ${__filename} `))
	delete require.cache[file]
	require(file)
});