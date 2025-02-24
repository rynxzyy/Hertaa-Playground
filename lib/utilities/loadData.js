require('../../settings.js');

async function LoadDataBase(neko, m) {
	try {
		const isNumber = x => typeof x === 'number' && !isNaN(x)
		const isBoolean = x => typeof x === 'boolean' && Boolean(x)
		let user = global.db.users[m.sender]
		
		if (typeof user !== 'object') global.db.users[m.sender] = {}
		if (!user) {
			global.db.users[m.sender] = {}
		}
		
		if (m.isGroup) {
			let group = global.db.groups[m.cht]
			if (typeof group !== 'object') global.db.groups[m.cht] = {}
			if (group) {
				if (!('mute' in group)) group.mute = false
			} else {
				global.db.groups[m.cht] = {
					mute: false,
				}
			}
		}
	} catch (e) {
		throw e;
	}
}

module.exports = { LoadDataBase };