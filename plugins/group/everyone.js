module.exports = {
    command: ['everyone', 'tagall'],
    category: ['group'],
    settings: {
        group: true
    },
    async run(m, { neko, text }) {
        let mem = m.metadata.participants.map(a => a.id)
        neko.sendMessage(m.chat, { 
            text: `@${m.chat} ${text || ''}`, 
            contextInfo: { 
                mentionedJid: mem, 
                groupMentions: [
    	            {
    		            groupSubject: `everyone`,
    		            groupJid: m.chat,
    	            },
                ],
            },
        });
    }
}