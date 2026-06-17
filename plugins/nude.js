const axios = require('axios');

module.exports = {
    command: 'waifu',
    description: 'Random NSFW waifu uchi (nude/semi-nude anime)',
    category: 'nsfw',
    execute: async (sock, m, { prefix, reply }) => {
        try {
            await sock.sendMessage(m.chat, { react: { text: "🍑", key: m.key } });

            let imageUrl = '';
            // Primary: waifu.pics NSFW
            try {
                const res = await axios.get('https://api.waifu.pics/nsfw/waifu');
                imageUrl = res.data.url;
            } catch (e) {
                // Fallback: waifu.im
                const res2 = await axios.get('https://api.waifu.im/search?included_tags=waifu&is_nsfw=true');
                imageUrl = res2.data.images?.[0]?.url || '';
            }

            if (!imageUrl) return await reply("❌ Hakuna picha iliyopatikana. Jaribu tena!");

            await sock.sendMessage(m.chat, {
                image: { url: imageUrl },
                caption: `🔥 Random NSFW Waifu Uchi\n🍑 Powered by DarkX-Ultra.`
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error(error);
            await reply("❌ Error fetching waifu uchi. Jaribu baadaye.");
        }
    }
};