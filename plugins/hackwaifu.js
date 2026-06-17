const axios = require('axios');

module.exports = {
    command: 'hackwaifu',
    description: 'Random NSFW cyberpunk hacker waifu (hacking style uchi)',
    category: 'nsfw',
    execute: async (sock, m, { prefix, reply }) => {
        try {
            await sock.sendMessage(m.chat, { react: { text: "💾", key: m.key } });

            let imageUrl = '';

            // Primary: Fluxpoint NSFW (inayo categories nyingi za anime uchi)
            try {
                const res = await axios.get('https://api.fluxpoint.dev/nsfw/img/lewd'); // lewd inafaa kwa cyberpunk vibe
                imageUrl = res.data.file || res.data.url;
            } catch (e) {
                // Fallback waifu.pics NSFW
                const res2 = await axios.get('https://api.waifu.pics/nsfw/waifu');
                imageUrl = res2.data.url;
            }

            if (!imageUrl) return await reply("❌ Hakuna picha iliyopatikana. Jaribu tena!");

            await sock.sendMessage(m.chat, {
                image: { url: imageUrl },
                caption: `💾 Hacking Style NSFW Waifu\nCyberpunk Netrunner Uchi 🔥\nNeon lights & code`
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error(error);
            await reply("❌ Error fetching hacking waifu. Jaribu baadaye.");
        }
    }
};