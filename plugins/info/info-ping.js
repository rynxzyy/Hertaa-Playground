const os = require('node:os');
const fs = require('node:fs');

module.exports = {
    command: ['ping'],
    category: ['info'],
    loading: true,
    async run(m, { neko, text, func }) {
        let start = performance.now(),
        node = process.memoryUsage(),
        info = await fetch('https://ipwho.is').then((a) => a.json()),
        cap = 
`*\`Bot Information\`*
> *Running On*: VPS
> *Uptime*: ${func.toDate(process.uptime() * 1000)}
> *Node Version*: ${process.version}

*\`Provider Information\`*
> *ISP*: ${info.connection.isp}
> *Organization*: ${info.connection.org}
> *Country*: ${info.country}
> *City*: ${info.city}
> *Flag*: ${info.flag.emoji}
> *Timezone*: ${info.timezone.id}

*\`Source Server Information\`*
> *Speed*: ${(performance.now() - start).toFixed(3)} ms
> *Uptime*: ${func.toDate(os.uptime() * 1000)}
> *Total Memory*: ${func.formatSize(os.totalmem() - os.freemem())} / ${func.formatSize(os.totalmem())}
> *CPU*: ${os.cpus()[0].model} ( ${os.cpus().length} CORE )
> *Release*: ${os.release()}
> *Type*: ${os.type()}

*\`Node.js Memory Usage\`*
${Object.entries(node).map(([a, b]) => `> *${a.capitalize()}*: ${func.formatSize(b)}`).join('\n')}`;
        
        neko.sendDocs(m.chat, cap, m);
    },
};
