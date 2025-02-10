const axios = require('axios');

module.exports = {
    command: ['waifu'],
    category: ['anime'],
    loading: true,
    async run(m, { neko }) {
        const { data } = await axios.get('https://api.waifu.pics/sfw/waifu');
        neko.sendButton(m.chat, [{
            type: "bubble",
            value: [["🔁", "!waifu"]]
        }], m, { image: { url: data.url }, caption: mess.done })
    }
}