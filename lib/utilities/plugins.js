const path = require('node:path');
const fs = require('node:fs');
const { promisify } = require('node:util');
const chokidar = require('chokidar');
const chalk = require('chalk');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

class PluginLoader {
    constructor(directory) {
        this.directory = directory;
        this.plugins = {};
    }

    async scandir(dir) {
        const subdirs = await readdir(dir);
        const files = await Promise.all(
            subdirs.map(async (subdir) => {
                const res = path.resolve(dir, subdir);
                return (await stat(res)).isDirectory() ? this.scandir(res) : res;
            }),
        );
        return files.reduce((a, f) => a.concat(f), []);
    }

    load = async () => {
        const files = await this.scandir(this.directory);
        for (const filename of files) {
            const relativePath = path.relative(process.cwd(), filename);
            try {
                this.plugins[relativePath] = require(filename);
            } catch (e) {
                console.log(chalk.bgHex('#e74c3c').bold(` Failed to load [ ${relativePath} ]: `) + e);
                delete this.plugins[relativePath];
            }
        }
    };

    watch = async () => {
        const watcher = chokidar.watch(path.resolve(this.directory), {
            persistent: true,
            ignoreInitial: true,
        });

        watcher
            .on('add', async (filename) => {
                const relativePath = path.relative(process.cwd(), filename);
                if (require.cache[filename]) {
                    delete require.cache[filename];
                }
                this.plugins[relativePath] = require(filename);
                console.log(chalk.bgHex('#90EE90').hex('#333').bold(` New plugin detected: ${filename} `));
                return this.load();
            })
            .on('change', async (filename) => {
                if (!filename.endsWith('.js')) return;
                const relativePath = path.relative(process.cwd(), filename);
                if (require.cache[filename]) {
                    delete require.cache[filename];
                }
                this.plugins[relativePath] = require(filename);
                console.log(chalk.bgHex('#90EE90').hex('#333').bold(` Files changed: ${filename} `));
                return this.load();
            })
            .on('unlink', (filename) => {
                const relativePath = path.relative(process.cwd(), filename);
                console.log(chalk.bgHex('#e74c3c').bold(` File deleted: ${filename} `));
                delete this.plugins[relativePath];
            });
    };
}

module.exports = PluginLoader;