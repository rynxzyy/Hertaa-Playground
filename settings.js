const fs = require('node:fs');

global.botName = 'hertaa'
global.owner = ['62xxx']
global.prefix = ['!']
global.customPairCode = 'HERTAAAA'
global.tz = 'Asia/Jakarta'

global.set = {
    self: false,
    read: true,
    call: true,
    typing: true
}

global.headertxt = '😼 Hertaa Playground-!!'
global.banner = fs.readFileSync('./lib/media/banner.jpg')
global.docs = fs.readFileSync('./lib/media/docs.txt')
global.footertxt = 'Hertaa based on NekoBott'

global.pack = {
    name: 'HertaaPack-!!', 
    author: 'wa.me/62xxx'
}

global.id = {
    newsletter: 'xxx@newsletter',
    newsletterName: 'Hertaa - Rynn Project.'
}

global.mess = {
    err: '> oops! something went wrong. please try again later.',
    wait: '> waitt..', 
    done: '> donee',
    owner: '> tch, you not my owner-!!', 
    group: '> this feature only for gc-!!',
    botAdmin: '> hmm?'
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log('\x1b[30m--------------------\x1b[0m');
	console.log(`Update ${__filename}`)
	delete require.cache[file]
	require(file)
});