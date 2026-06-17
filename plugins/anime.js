const axios = require('axios');
const config = require("../settings/config");

module.exports = {
    command: ["anime", "waifu", "otaku"],
    description: "Get a high-quality SFW anime character image.",
    category: "anime",
    execute: async (sock, m, { text, prefix, reply }) => {
        try {
            // Reaction ya kuanza kazi
            await sock.sendMessage(m.chat, { react: { text: "🎭", key: m.key } });

            // Chagua tag (Default ni waifu kama user hajaandika kitu)
            let type = text ? text.toLowerCase().trim() : 'waifu';
            const validTypes = ['waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'smile', 'wave'];
            
            if (!validTypes.includes(type)) type = 'waifu';

            let imageUrl = '';
            try {
                // Tunatumia waifu.pics kwa SFW content bora zaidi
                const res = await axios.get(`https://api.waifu.pics/sfw/${type}`);
                imageUrl = res.data.url;
            } catch (e) {
                // Fallback ikiwa API ya kwanza ikigoma
                const res2 = await axios.get('https://api.waifu.im/search?is_nsfw=false&limit=1');
                imageUrl = res2.data.images?.[0]?.url;
            }

            if (!imageUrl) {
                return await reply("❌ 𝖲𝗒𝗌𝗍𝖾𝗆 𝖤𝗋𝗋𝗈𝗋: 𝖧𝖺𝗄𝗎𝗇𝖺 𝖺𝗇𝗂𝗆𝖾 𝗂𝗆𝖺𝗀𝖾 𝗂𝗅𝗂𝗒𝗈𝗉𝖺𝗍𝗂𝗄𝖺.");
            }

            const animeCaption = `
┏━━━━━━━◥◣◆◢◤━━━━━━━┓
     *ΛПIMΞ ЦᄂƬЯΛ VIBΞ*
┗━━━━━━━◥◣◆◢◤━━━━━━━┛

*〔 👤 𝖢𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋 〕:* ${type.toUpperCase()}
*〔 📂 𝖢𝖺𝗍𝖾𝗀𝗈𝗋𝗒 〕:* 𝖲𝖥𝖶 (𝖲𝖺𝖿𝖾)
*〔 ⚙️ 𝖤𝗇𝗀𝗂𝗇𝖾 〕:* 𝖣𝖺𝗋𝗄𝖷 𝖠𝖨

> _“𝖡𝖾𝗅𝗂𝖾𝗏𝖾 𝗂𝗍! 𝖤𝗏𝖾𝗋𝗒 𝖼𝗈𝖽𝖾 𝗁𝖺𝗌 𝖺 𝗌𝗈𝗎𝗅.”_
_Powered by MrX Dev_`;

            // Tuma Picha
            await sock.sendMessage(m.chat, {
                image: { url: imageUrl },
                caption: animeCaption,
                contextInfo: {
                    externalAdReply: {
                        title: "DARKX ANIME SYSTEM",
                        body: "Mwana wa Mzee King Project",
                        mediaType: 1,
                        thumbnailUrl: imageUrl,
                        sourceUrl: "https://github.com/DarkX-Official",
                        renderLargerThumbnail: false,
                        showAdAttribution: true
                    }
                }
            }, { quoted: m });

            // Success reaction
            await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error("Anime Plugin Error:", error);
            await reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝖺𝗇𝗂𝗆𝖾 𝖽𝖺𝗍𝖺. 𝖩𝖺𝗋𝗂𝖻𝗎 𝗍𝖾𝗇𝖺 𝖻𝖺𝖺𝖽𝖺𝗒𝖾.");
        }
    }
};
