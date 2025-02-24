async function events(m, { neko }) {
    if (m.type === "interactiveResponseMessage" && m.quoted.fromMe) {
        neko.appendTextMessage(m, JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id, m);
    }
    if (m.type === "templateButtonReplyMessage" && m.quoted.fromMe) {
        neko.appendTextMessage(m, m.msg.selectedId, m);
    }
}

module.exports = { events };
