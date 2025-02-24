const fs = require('node:fs');
const path = require('path');
const chalk = require('chalk');

class dataBase {
	data = {}
	file = path.join(process.cwd(), 'database', 'neko-db.json');
	
	read = async () => {
		let data;
		if (fs.existsSync(this.file)) {
			data = JSON.parse(fs.readFileSync(this.file))
		} else {
			fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2))
			data = this.data
		}
		return data
	}
	
	write = async (data) => {
		this.data = !!data ? data : global.db
		let dirname = path.dirname(this.file)
		if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true })
		fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2))
		return this.file
	}
}

module.exports = dataBase