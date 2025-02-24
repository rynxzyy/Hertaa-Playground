const chokidar = require('chokidar');
const path = require('node:path');
const fs = require('node:fs');
const { promisify } = require('node:util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const Scandir = async (dir) => {
    let subdirs = await readdir(path.resolve(dir));
    let files = await Promise.all(
        subdirs.map(async (subdir) => {
            let res = path.resolve(path.resolve(dir), subdir);
            return (await stat(res)).isDirectory() ? Scandir(res) : res;
        }),
    );
    return files.reduce((a, f) => a.concat(f), []);
};

class Scraper {
    #src;
    constructor(dir) {
        this.dir = dir;
        this.#src = {};
    }
    
    load = async () => {
        let data = await Scandir('./lib/scrape');
        for (let i of data) {
            let name = i.split('/').pop().replace('.js', '');
            try {
                if (!i.endsWith('.js')) return;
                this.#src[name] = require(i);
            } catch (e) {
                console.log('\x1b[30m--------------------\x1b[0m');
                console.log(`Failed to load Scraper : ${e}`);
                delete this.#src[name];
            }
        }
        return this.#src;
    };
    
    watch = async () => {
        const watcher = chokidar.watch(path.resolve(this.dir), {
            persistent: true,
            ignoreInitial: true,
        });
        watcher.on('add', async (filename) => {
            if (!filename.endsWith('.js')) return;
            let name = filename.split('/').pop().replace('.js', '');
            if (require.cache[filename]) {
                delete require.cache[filename];
                this.#src[name] = require(filename);
                return this.load();
            }
            this.#src[name] = require(filename);
            console.log('\x1b[30m--------------------\x1b[0m');
            console.log(`New Scraper has been added : ${name}`);
            return this.load();
        });
        watcher.on('change', (filename) => {
            if (!filename.endsWith('.js')) return;
            let name = filename.split('/').pop().replace('.js', '');
            if (require.cache[filename]) {
                delete require.cache[filename];
                this.#src[name] = require(filename);
                return this.load();
            }
            console.log('\x1b[30m--------------------\x1b[0m');
            console.log(`Scraper has been changed : ${name}`);
            return this.load();
        });
        watcher.on('unlink', (filename) => {
            if (!filename.endsWith('.js')) return;
            let name = filename.split('/').pop().replace('.js', '');
            delete this.#src[name];
            console.log('\x1b[30m--------------------\x1b[0m');
            console.log(`Scraper has been removed : ${name}`);
            return this.load();
        });
    };
    
    list = () => this.#src;
}

module.exports = Scraper;