const axios = require('axios');
const config = require("../settings/config");

module.exports = {
    command: ["facebook", "fb", "fbdl"],
    execute: async (sock, m, args, { reply }) => {
        const url = args[0];
        
        if (!url) {
            return reply(`📘 *Facebook Downloader*\n\nMatumizi:\n${config.prefix}fb <link ya video>`);
        }

        // Uhakiki wa link ya Facebook
        if (!/facebook\.com|fb\.watch/i.test(url)) {
            return reply("❌ Link ya Facebook siyo sahihi.");
        }

        try {
            await sock.sendMessage(m.chat, { react: { text: '🔄', key: m.key } });

            // Tunatumia API (Hakikisha APIKEY ni sahihi au tumia Public API)
            const apiUrl = `https://gtech-api-xtp1.onrender.com/api/download/fb?url=${encodeURIComponent(url)}&apikey=APIKEY`;
            
            const res = await axios.get(apiUrl, { timeout: 60000 });
            const data = res.data;

            if (!data.status || !data.data || !data.data.data) {
                return reply("❌ Sikuweza kupata video hiyo. Inawezekana ni Private au link imekufa.");
            }

            const videos = data.data.data;
            // Kuchagua video yenye quality nzuri (SD au HD)
            const videoUrl = videos[0].url; 

            const caption = `📘 *DARKX FB DOWNLOADER*\n\n✅ Tayari! Video yako imepatikana.\n\n> 👑 *${config.botName}*`;

            await sock.sendMessage(m.chat, { 
                video: { url: videoUrl }, 
                mimetype: 'video/mp4', 
                caption: caption 
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        } catch (err) {
            console.error('Facebook downloader error:', err);
            reply("❌ Hitilafu imetokea wakati wa kudownload. Jaribu tena baadae.");
        }
    }
};
