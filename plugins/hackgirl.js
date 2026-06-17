const axios = require('axios');
const config = require("../settings/config");

module.exports = {
    command: ["cyber", "hackerart", "neon"],
    description: "Get high-quality Cyberpunk and Hacker aesthetics (SFW).",
    category: "cybersecurity",
    execute: async (sock, m, { text, reply, prefix }) => {
        try {
            // Reaction ya kuanza kazi ya kitalamu
            await sock.sendMessage(m.chat, { react: { text: "🖥️", key: m.key } });

            // Styles za kitalamu za Cyberpunk
            let style = text ? text.toLowerCase().trim() : 'cyberpunk';
            const validStyles = ['cyberpunk', 'hacker', 'neon', 'tech', 'future', 'netrunner'];
            
            if (!validStyles.includes(style)) style = 'cyberpunk';

            // Tunatumia API inayotoa picha kali za anime/digital art za kijanja
            let imageUrl = '';
            try {
                // SFW Cyberpunk vibes kutoka waifu.pics au nekos.best
                const res = await axios.get(`https://api.waifu.pics/sfw/waifu`);
                imageUrl = res.data.url;
            } catch (e) {
                imageUrl = "https://files.catbox.moe/pc5uec.png"; // Fallback yako ya Hacker
            }

            const cyberCaption = `
┏━━━━━━━◥◣◆◢◤━━━━━━━┓
     *ＣＹＢΞＲＰＵＮＫ  ΛＲＴ*
┗━━━━━━━◥◣◆◢◤━━━━━━━┛

*〔 👤 Tʏᴘᴇ 〕:* ${style.toUpperCase()}
*〔 🌐 Dᴏᴍᴀɪɴ 〕:* 𝖣𝗂𝗀𝗂𝗍𝖺𝗅 𝖥𝗋𝗈𝗇𝗍𝗂𝖾𝗋
*〔 ⚙️ S𝗒𝗌𝗍𝖾𝗆 〕:* 𝖣𝖺𝗋𝗄𝖷 𝖴𝗅𝗍𝗋𝖺 𝗏𝟨.𝟢

> *“Code is the new law of the universe.”*
_Mwana wa Mzee King Project_`;

            await sock.sendMessage(m.chat, {
                image: { url: imageUrl },
                caption: cyberCaption,
                contextInfo: {
                    externalAdReply: {
                        title: "DARKX CYBER-SYSTEM",
                        body: `Style: ${style}`,
                        mediaType: 1,
                        thumbnailUrl: imageUrl,
                        sourceUrl: "https://github.com/DarkX-Official",
                        renderLargerThumbnail: true,
                        showAdAttribution: true
                    }
                }
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error("Cyber Plugin Error:", error);
            await reply("❌ 𝖲𝗒𝗌𝗍𝖾𝗆 𝖥𝖺𝗂𝗅𝗎𝗋𝖾: 𝖧𝖺𝗄𝗎𝗇𝖺 𝖼𝗒𝖻𝖾𝗋 𝖺𝗋𝗍 𝗂𝗅𝗂𝗒𝗈𝗉𝖺𝗍𝗂𝗄𝖺.");
        }
    }
};
