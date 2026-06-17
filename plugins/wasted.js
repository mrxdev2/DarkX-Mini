const axios = require('axios');

module.exports = {
    command: ['wasted', 'waste'],
    category: 'fun',
    description: 'Weka picha ya mtu kwenye kifo cha GTA (Wasted)',
    execute: async (sock, m, { reply }) => {
        // 1. Kutafuta nani wa kum-waste (Mention, Reply, au mhusika)
        let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;

        if (!who) return reply('⚰️ *Wasted Tool*\n\nTag mtu au reply meseji yake ili kum-waste!');

        await sock.sendMessage(m.chat, { react: { text: '💀', key: m.key } });

        try {
            // 2. Kuchukua picha ya Profile (PP)
            let pp;
            try {
                pp = await sock.profilePictureUrl(who, 'image');
            } catch {
                // Picha mbadala kama hana PP
                pp = 'https://telegra.ph/file/dcce2ddee66e746536093.jpg'; 
            }

            // 3. Kutengeneza picha kupitia API
            const wastedApi = `https://some-random-api.com/canvas/overlay/wasted?avatar=${encodeURIComponent(pp)}`;
            
            // Tunatumia Axios kupata image data
            const response = await axios.get(wastedApi, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'utf-8');

            // 4. Kutuma picha iliyotengenezwa
            await sock.sendMessage(m.chat, {
                image: buffer,
                caption: `⚰️ *WASTED BY DARKX-MINI* 💀\n\nRest in pieces, @${who.split('@')[0]}!`,
                mentions: [who]
            }, { quoted: m });

        } catch (e) {
            console.error('Wasted Error:', e);
            reply('❌ Imeshindwa kutengeneza picha. Huenda API ina matatizo.');
        }
    }
};
