const axios = require('axios');

module.exports = {
    command: ['neko'],
    category: ['anime'],
    loading: true,
    async run(m, { neko }) {
        const { data } = await axios.get('https://api.waifu.pics/sfw/neko');
        neko.sendButton(m.chat, [{
            type: "bubble",
            value: [["🔁", "!neko"]]
        }], m, { image: { url: data.url }, caption: mess.done })
    }
}