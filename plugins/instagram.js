const { igdl } = require('ruhend-scraper');

module.exports = {
    command: ['instagram', 'ig', 'igdl', 'insta'],
    category: 'download',
    description: 'Download Instagram posts, reels & videos',
    execute: async (sock, m, { args, reply, text }) => {
        if (!text) return reply('📸 *Instagram Downloader*\n\nUsage:\n.ig <link ya post/reel>');

        // Check kama ni link ya IG kweli
        const igRegex = /https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/(p|reel|tv|reels)\//i;
        if (!igRegex.test(text)) return reply('❌ Link uliyotuma siyo ya Instagram!');

        try {
            // Reaction kuonyesha bot inafanya kazi
            await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

            const res = await igdl(text);
            if (!res || !res.data || res.data.length === 0) {
                return reply('❌ Sikuweza kupata media. Huenda akaunti ni Private au link imekufa.');
            }

            // Kuchuja media ili zisijirudie
            const mediaList = res.data;

            for (let i = 0; i < mediaList.length; i++) {
                const mediaUrl = mediaList[i].url;
                
                // Kuangalia kama ni video au picha
                const isVideo = text.includes('/reel/') || text.includes('/reels/') || text.includes('/tv/');

                if (isVideo) {
                    await sock.sendMessage(m.chat, {
                        video: { url: mediaUrl },
                        mimetype: 'video/mp4',
                        caption: `📥 *DarkX-Mini Downloader*`
                    }, { quoted: m });
                } else {
                    await sock.sendMessage(m.chat, {
                        image: { url: mediaUrl },
                        caption: `📥 *DarkX-Mini Downloader*`
                    }, { quoted: m });
                }
                
                // Delay kidogo kama kuna picha nyingi (Slide) ili kuzuia spam block
                if (mediaList.length > 1) await new Promise(resolve => setTimeout(resolve, 1500));
            }

            // Success reaction
            await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        } catch (err) {
            console.error('IG Error:', err);
            reply('❌ Imeshindwa kupakua! Jaribu tena baadae au angalia link yako.');
        }
    }
};
