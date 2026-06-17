const axios = require('axios');

module.exports = {
    command: 'waifu',
    description: 'Random NSFW waifu / hentai image (uchi)',
    category: 'nsfw',
    execute: async (sock, m, { text, prefix, reply }) => {
        try {
            await sock.sendMessage(m.chat, { react: { text: "🔥", key: m.key } });

            // Jaribu waifu.pics NSFW first (inayofanya kazi vizuri)
            let imageUrl = '';
            try {
                const res = await axios.get('https://api.waifu.pics/nsfw/waifu');
                imageUrl = res.data.url;
            } catch (e) {
                // Fallback kwa waifu.im NSFW
                const res2 = await axios.get('https://api.waifu.im/images?IsNsfw=True&IncludedTags=waifu');
                imageUrl = res2.data.images[0]?.url || '';
            }

            if (!imageUrl) return reply("❌ Hakuna picha iliyopatikana. Jaribu tena.");

            await sock.sendMessage(m.chat, {
                image: { url: imageUrl },
                caption: `🔥 Random NSFW Waifu\nUchi style 🔥\nPowered by Bot`
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error('Waifu error:', error);
            await reply("❌ Failed to fetch waifu image. Jaribu baadaye.");
        }
    }
};