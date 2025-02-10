const fs = require('node:fs');
const chalk = require('chalk');

global.botName = 'hertaa'
global.owner = ['62xxx']
global.prefix = ['!']
global.customPairCode = 'HERTAAAA'
global.tz = 'Asia/Jakarta'

global.headertxt = 'Hertaa Playground-!!'
global.banner = fs.readFileSync('./lib/media/banner.jpg')
global.docs = fs.readFileSync('./lib/media/docs.txt')
global.footertxt = 'Hertaa based on NekoBott'

global.pack = {
    name: 'HertaaPack-!!', 
    author: 'hertaa'
}

global.id = {
    newsletter: 'xxx@newsletter'
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
	console.log(chalk.bgHex('#e74c3c').bold(` Update ${__filename} `))
	delete require.cache[file]
	require(file)
});