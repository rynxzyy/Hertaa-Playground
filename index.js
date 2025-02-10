(async () => {
    require('./settings.js');
    const { default: makeWASocket, useMultiFileAuthState, jidNormalizedUser, fetchLatestBaileysVersion, Browsers, proto, makeInMemoryStore, DisconnectReason, delay, generateWAMessage, getAggregateVotesInPollMessage, areJidsSameUser } = require('baileys');
    const pino = require('pino');
    const { Boom } = require('@hapi/boom');
    const chalk = require('chalk');
    const readline = require('node:readline');
    const simple = require('./lib/simple');
    const fs = require('node:fs');
    const pkg = require('./package.json');
    const moment = require('moment-timezone');
    const dataBase = require('./lib/utilities/database');
    const append = require('./lib/append');
    const serialize = require('./lib/serialize');

    const appenTextMessage = async (m, neko, text, chatUpdate) => {
        let messages = await generateWAMessage(m.key.remoteJid, { text: text }, { quoted: m.quoted });
        messages.key.fromMe = areJidsSameUser(m.sender, neko.user.id);
        messages.key.id = m.key.id;
        messages.pushName = m.pushName;
        if (m.isGroup) messages.participant = m.sender;
        let msg = {
            ...chatUpdate,
            messages: [proto.WebMessageInfo.fromObject(messages)],
            type: 'append',
        };
        return neko.ev.emit('messages.upsert', msg);
    };

    const question = (text) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        return new Promise((resolve) => {
            rl.question(text, resolve);
        });
    };
    
    const database = new dataBase();
    const loadData = await database.read()
	if (loadData && Object.keys(loadData).length === 0) {
		global.db = {
			users: {},
			groups: {},
			set: {
                self: true,
                read: false,
                call: false,
                typing: false
            },
			...(loadData || {}),
		}
		await database.write(global.db)
	} else {
		global.db = loadData
	}

    global.plug = new(await require('./lib/utilities/plugins'))('./plugins');
    await plug.watch();

    global.scraper = new(await require('./lib/scrape'))('./lib/scrape/src');
    await scraper.watch();

    setInterval(async () => {
        if (global.db) await database.write(global.db)
        await plug.load();
        await scraper.load();
    }, 2000);

    const store = makeInMemoryStore({
        logger: pino().child({
            level: 'silent',
            stream: 'store',
        }),
    });
    
    console.log('\x1b[30m--------------------\x1b[0m');
    console.log(chalk.bgHex('#FFFF99').hex('#333').bold(' Hertaa-Playground based on NekoBot by AxellNetwork-! '))
    console.log(chalk.bgHex('#FFFF99').hex('#333').bold(' Waitt... '))

    async function system() {
        const { state, saveCreds } = await useMultiFileAuthState('session');
        const neko = simple({
                logger: pino({
                    level: 'silent'
                }),
                printQRInTerminal: false,
                auth: state,
                version: [2, 3000, 1019441105],
                browser: Browsers.ubuntu('Edge'),
            },
            store,
        );
        store.bind(neko.ev);
        if (!neko.authState.creds.registered) {
            console.log(chalk.bgHex('#FFFF99').hex('#333').bold(' Enter your WhatsApp number, for example +628xxxx '));
            const phoneNumber = await question(``);
            const code = await neko.requestPairingCode(phoneNumber, customPairCode);
            setTimeout(() => {
                console.log(` Your pairing code: ${code} `);
            }, 3000);
        }

        neko.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                if (lastDisconnect.error == 'Error: Stream Errored (unknown)') {
                } else if (reason === DisconnectReason.badSession) {
                    console.log(chalk.bgHex('#e74c3c').bold(' Bad session file, Please delete session and rescan '));
                } else if (reason === DisconnectReason.connectionClosed) {
                    console.log(chalk.bgHex('#FFFF99').hex('#333').bold(' Connection closed, trying to reconnect... '));
                } else if (reason === DisconnectReason.connectionLost) {
                    console.log(chalk.bgHex('#FFFF99').hex('#333').bold(' Connection lost, trying to reconnect... '));
                } else if (reason === DisconnectReason.connectionReplaced) {
                    console.log(chalk.bgHex('#90EE90').hex('#333').bold(' Connection changed, another session has been opened. Please close the running session. '));
                    neko.logout();
                } else if (reason === DisconnectReason.loggedOut) {
                    console.log(chalk.bgHex('#90EE90').hex('#333').bold(' Device logged out, please rescan. '));
                    neko.logout();
                } else if (reason === DisconnectReason.restartRequired) {
                    console.log(chalk.bgHex('#90EE90').hex('#333').bold(' Restart required, restarting... '));
                    system();
                } else if (reason === DisconnectReason.timedOut) {
                    console.log(chalk.bgHex('#90EE90').hex('#333').bold(' Connection timed out, trying to reconnect... '));
                    system();
                }
            } else if (connection === 'connecting') {
                console.log(chalk.bgHex('#FFFF99').hex('#333').bold(' Connecting to WhatsApp... '));
            } else if (connection === 'open') {
                console.log(chalk.bgHex('#90EE90').hex('#333').bold(' Bot successfully connected. '));
                console.log('Connected to : ' + JSON.stringify(neko.user, null, 2));
            }
        });

        neko.ev.on('creds.update', saveCreds);

        neko.ev.on('contacts.update', (update) => {
            for (let contact of update) {
                let id = jidNormalizedUser(contact.id);
                if (store && store.contacts)
                    store.contacts[id] = {
                        ...(store.contacts?.[id] || {}),
                        ...(contact || {}),
                    };
            }
        });

        neko.ev.on('contacts.upsert', (update) => {
            for (let contact of update) {
                let id = jidNormalizedUser(contact.id);
                if (store && store.contacts)
                    store.contacts[id] = {
                        ...(contact || {}),
                        isContact: true
                    };
            }
        });

        neko.ev.on('groups.update', (updates) => {
            for (const update of updates) {
                const id = update.id;
                if (store.groupMetadata[id]) {
                    store.groupMetadata[id] = {
                        ...(store.groupMetadata[id] || {}),
                        ...(update || {}),
                    };
                }
            }
        });

        neko.ev.on('group-participants.update', ({ id, participants, action }) => {
            const metadata = store.groupMetadata[id];
            if (metadata) {
                switch (action) {
                    case 'add':
                    case 'revoked_membership_requests':
                        metadata.participants.push(
                            ...participants.map((id) => ({
                                id: jidNormalizedUser(id),
                                admin: null,
                            })),
                        );
                        break;
                    case 'demote':
                    case 'promote':
                        for (const participant of metadata.participants) {
                            let id = jidNormalizedUser(participant.id);
                            if (participants.includes(id)) {
                                participant.admin = action === 'promote' ? 'admin' : null;
                            }
                        }
                        break;
                    case 'remove':
                        metadata.participants = metadata.participants.filter(
                            (p) => !participants.includes(jidNormalizedUser(p.id)),
                        );
                        break;
                }
            }
        });

        async function getMessage(key) {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id);
                return msg;
            }
            return {
                conversation: 'NekoBot',
            };
        }

        neko.ev.on('messages.upsert', async (cht) => {
            if (cht.messages.length === 0) return;
            const chatUpdate = cht.messages[0];
            if (!chatUpdate.message) return;
            const userId = chatUpdate.key.id;
            global.m = await serialize(chatUpdate, neko, store);
            if (m.isBot) return;
            if (!m.isOwner && db.set.self) return;
            require('./lib/utilities/logger.js')(m);
            await require('./handler.js')(m, neko, store);
        });

        neko.ev.on('messages.update', async (chatUpdate) => {
            for (const { key, update } of chatUpdate) {
                if (update.pollUpdates && key.fromMe) {
                    const pollCreation = await getMessage(key);
                    if (pollCreation) {
                        let pollUpdate = await getAggregateVotesInPollMessage({
                            message: pollCreation?.message,
                            pollUpdates: update.pollUpdates,
                        });
                        let toCmd = pollUpdate.filter((v) => v.voters.length !== 0)[0]
                            ?.name;
                        console.log(toCmd);
                        await appenTextMessage(m, neko, toCmd, pollCreation);
                        await neko.sendMessage(m.chat, {
                            delete: key
                        });
                    } else return false;
                    return;
                }
            }
        });

        return neko;
    }
    system();
})();