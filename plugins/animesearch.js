const axios = require('axios');
const config = require("../settings/config");

module.exports = {
    command: ["animesearch", "animeinfo", "findanime"],
    description: "Search for detailed SFW anime information and images.",
    category: "anime",
    execute: async (sock, m, { text, reply, prefix }) => {
        try {
            if (!text) return await reply(`*⚠️ Usage:* ${prefix}animesearch <jina la anime>\n*Example:* ${prefix}animesearch Naruto`);

            // Reaction ya kuanza utafutaji
            await sock.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });

            // Search kwa kutumia Jikan API (MyAnimeList)
            const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}&limit=1`);
            const data = res.data.data[0];

            if (!data) {
                return await reply(`❌ 𝖲𝗒𝗌𝗍𝖾𝗆 𝖤𝗋𝗋𝗈𝗋: 𝖠𝗇𝗂𝗆𝖾 "${text}" 𝗁𝖺𝗂𝗄𝗎𝗉𝖺𝗍𝗂𝗄𝖺 𝗄𝗐𝖾𝗇𝗒𝖾 𝖽𝖺𝗍𝖺𝖻𝖺𝗌𝖾.`);
            }

            // Kuchuja taarifa
            const title = data.title;
            const rating = data.score || "N/A";
            const episodes = data.episodes || "Unknown";
            const type = data.type || "TV";
            const status = data.status || "Unknown";
            const synopsis = data.synopsis ? data.synopsis.substring(0, 300) + "..." : "No description available.";
            const imageUrl = data.images.jpg.large_image_url;

            const animeDetails = `
┏━━━━━━━◥◣◆◢◤━━━━━━━┓
     *ΛПIMΞ SΞΛЯCＨ 
┗━━━━━━━◥◣◆◢◤━━━━━━━┛

*〔 📺 Tɪᴛʟᴇ 〕:* ${title}
*〔 ⭐ Rᴀᴛɪɴɢ 〕:* ${rating}
*〔 🎞️ Eᴘɪsᴏᴅᴇs 〕:* ${episodes}
*〔 📂 Tʏᴘᴇ 〕:* ${type}
*〔 📊 Sᴛᴀᴛᴜs 〕:* ${status}

*〔 📖 Sʏɴᴏᴘsɪs 〕:* _${synopsis}_

> *“Search power provided by DarkX AI”*
_Mwana wa Mzee King Project_`;

            // Tuma Picha na Maelezo
            await sock.sendMessage(m.chat, {
                image: { url: imageUrl },
                caption: animeDetails,
                contextInfo: {
                    externalAdReply: {
                        title: `Result for: ${title}`,
                        body: "DarkX Ultra v6.0.0 Search System",
                        mediaType: 1,
                        thumbnailUrl: imageUrl,
                        sourceUrl: data.url,
                        renderLargerThumbnail: true,
                        showAdAttribution: true
                    }
                }
            }, { quoted: m });

            // Success reaction
            await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error("Anime Search Error:", error);
            await reply("❌ 𝖲𝖾𝖺𝗋𝖼𝗁 𝗂𝗆𝖾𝗌𝗁𝗂𝗇𝖽𝗐𝖺. 𝖩𝖺𝗋𝗂𝖻𝗎 𝗍𝖾𝗇𝖺 𝖻𝖺𝖺𝖽𝖺𝗒𝖾.");
        }
    }
};
