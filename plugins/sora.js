const axios = require('axios');

module.exports = {
    command: ['sora', 'txt2video', 'aivideo'],
    category: 'ai',
    description: 'Tengeneza video kwa kutumia AI kutokana na maandishi',
    execute: async (sock, m, { args, text, reply }) => {
        // Kuchukua input kutoka kwa args au kama mtu ame-quote meseji
        const input = text || (m.quoted ? (m.quoted.text || m.quoted.caption) : null);

        if (!input) {
            return reply('🎨 *AI Video Generator*\n\n*Matumizi:* .sora anime girl running in the rain\n\n*Kumbuka:* AI inachukua muda kidogo kutengeneza video.');
        }

        // Kuonyesha bot imeanza kazi (Reaction)
        await sock.sendMessage(m.chat, { react: { text: '🎬', key: m.key } });
        
        try {
            // Tunatuma ujumbe wa kwanza kutoa taarifa
            await reply(`⏳ *DarkX AI* inatengeneza video yako...\nPrompt: _${input}_`);

            const apiUrl = `https://okatsu-rolezapiiz.vercel.app/ai/txt2video?text=${encodeURIComponent(input)}`;
            
            // Timeout nimeiweka 120000ms (dakika 2) kwa sababu AI ya video ni nzito
            const { data } = await axios.get(apiUrl, { 
                timeout: 120000, 
                headers: { 'user-agent': 'Mozilla/5.0' } 
            });

            const videoUrl = data?.videoUrl || data?.result || data?.data?.videoUrl;

            if (!videoUrl) {
                throw new Error('API haijarudisha link ya video.');
            }

            // Kutuma video kwa mtumiaji
            await sock.sendMessage(m.chat, {
                video: { url: videoUrl },
                mimetype: 'video/mp4',
                caption: `✅ *AI Video Generated*\n\n*Prompt:* ${input}\n*Model:* Sora AI Concept`,
            }, { quoted: m });

            // Success reaction
            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (error) {
            console.error('[SORA ERROR]:', error.message);
            
            // Kama API itachelewa sana (timeout)
            if (error.code === 'ECONNABORTED') {
                return reply('⚠️ *Timeout!* AI imechukua muda mrefu sana. Jaribu prompt fupi au jaribu tena baadae kidogo.');
            }
            
            reply('❌ Imeshindwa kutengeneza video. Huenda API ina matatizo kwa sasa.');
        }
    }
};
