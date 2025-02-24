const { generateWAMessage, areJidsSameUser, proto } = require("baileys");

async function events(m, { neko }) {
    neko.sendAliasMessage = async (jid, mess = {}, alias = {}, quoted = null) => {
        function check(arr) {
            if (!Array.isArray(arr)) {
                return false;
            }
            if (!arr.length) {
                return false;
            }
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                if (typeof item !== "object" || item === null) {
                    return false;
                }
                if (!Object.prototype.hasOwnProperty.call(item, "alias")) {
                    return false;
                }
                if (!Array.isArray(item.alias) && typeof item.alias !== "string") {
                    return false;
                }
                if (Object.prototype.hasOwnProperty.call(item, "response") && typeof item.response !== "string") {
                    return false;
                }
                if (Object.prototype.hasOwnProperty.call(item, "eval") && typeof item.eval !== "string") {
                    return false;
                }
            }
            return true;
        }
        if (!check(alias)) return "Alias format is not valid!";
        let message = await neko.sendMessage(jid, mess, { quoted: quoted });
        if (typeof neko.alias[jid] === "undefined") neko.alias[jid] = {};
        neko.alias[jid][message.key.id] = {
            chat: jid,
            id: message.key.id,
            alias,
        };
        return message;
    };
    neko.sendInputMessage = async (jid, mess = {}, target = "all", timeout = 60000, quoted = null) => {
        let time = Date.now();
        let message = await neko.sendMessage(jid, mess, { quoted: quoted });
        if (typeof neko.input[jid] === "undefined") neko.input[jid] = {};
        neko.input[jid][message.key.id] = {
            chat: jid,
            id: message.key.id,
            target,
        };

        while (Date.now() - time < timeout && !neko.input[jid][message.key.id].hasOwnProperty("input")) await neko.delay(500);

        return neko.input[jid][message.key.id].input;
    };

    if (typeof neko.alias === "undefined") neko.alias = {};
    if (typeof neko.input === "undefined") neko.input = {};

    if (m.quoted) {
        const quotedId = m.quoted.id;
        if (neko.input[m.chat]?.[quotedId]?.target === "all" || neko.input[m.chat]?.[quotedId]?.target === m.sender) {
            neko.input[m.chat][quotedId].input = m.body;
        }
        if (neko.alias.hasOwnProperty(m.chat)) {
            if (neko.alias[m.chat].hasOwnProperty(quotedId)) {
                for (const aliasObj of neko.alias[m.chat][quotedId].alias) {
                    if (Array.isArray(aliasObj.alias) && !aliasObj.alias.map((v) => v.toLowerCase()).includes(m.body.toLowerCase())) continue;
                    else if (aliasObj.alias.toLowerCase() !== m.body.toLowerCase()) continue;
                    else {
                        if (aliasObj.response) await m.emit(aliasObj.response);
                        if (aliasObj.eval) await eval(aliasObj.eval);
                    }
                }
            }
        }
    }
};

module.exports = { events };