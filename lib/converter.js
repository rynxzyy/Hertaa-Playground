const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
    return new Promise(async (resolve, reject) => {
        try {
            let tmp = process.cwd() + '/tmp/ffmpeg_' + Date.now() + '.' + ext;
            let out = tmp + '.' + ext2;
            await fs.promises.writeFile(tmp, buffer);
            spawn('ffmpeg', ['-y', '-i', tmp, ...args, out])
                .on('error', reject)
                .on('close', async (code) => {
                    try {
                        await fs.promises.unlink(tmp);
                        if (code !== 0) return reject(code);
                        resolve({
                            data: await fs.promises.readFile(out),
                            filename: out
                        });
                    } catch (e) {
                        reject(e);
                    }
                });
        } catch (e) {
            reject(e);
        }
    });
}

function toPTT(buffer, ext) {
    return ffmpeg(
        buffer,
        ['-vn', '-c:a', 'libmp3lame', '-b:a', '128k', '-vbr', 'on'],
        ext,
        'mp3',
    );
}

function toAudio(buffer, ext) {
    return ffmpeg(
        buffer,
        [
            '-vn',
            '-c:a',
            'libmp3lame',
            '-b:a',
            '128k',
            '-vbr',
            'on',
            '-compression_level',
            '10',
        ],
        ext,
        'mp3',
    );
}

function toVideo(buffer, ext) {
    return ffmpeg(
        buffer,
        [
            '-c:v',
            'libx264',
            '-c:a',
            'aac',
            '-ab',
            '128k',
            '-ar',
            '44100',
            '-crf',
            '32',
            '-preset',
            'slow',
        ],
        ext,
        'mp4',
    );
}

module.exports = { toAudio, toPTT, toVideo, ffmpeg };