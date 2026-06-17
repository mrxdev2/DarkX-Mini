const axios = require('axios');

module.exports = {
    command: 'neko',
    description: 'Random cute SFW anime neko girl',
    category: 'anime',
    execute: async (sock, m, { reply }) => {
        try {
            await sock.sendMessage(m.chat, { react: { text: "🐱", key: m.key } });

            let imageUrl = '';
            try {
                const res = await axios.get('https://api.waifu.pics/sfw/neko');
                imageUrl = res.data.url;
            } catch (e) {
                const res2 = await axios.get('https://api.waifu.im/search?is_nsfw=false&included_tags=neko&limit=1');
                imageUrl = res2.data.images?.[0]?.url || '';
            }

            if (!imageUrl) return await reply("❌ Hakuna neko image.");

            await sock.sendMessage(m.chat, {
                image: { url: imageUrl },
                caption: `🐱 Cute Anime Neko Girl\nSFW - Anime Style 🌸`
            }, { quoted: m });

        } catch (error) {
            await reply("❌ Failed to load neko image.");
        }
    }
};