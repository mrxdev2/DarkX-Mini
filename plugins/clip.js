const axios = require('axios');

module.exports = {
    command: 'clip',
    description: 'Download video MP4 from multiple sources (YouTube, TikTok, etc)',
    category: 'downloader',
    execute: async (sock, m, { text, prefix, reply }) => {
        if (!text) return await reply(`🎥 Usage: ${prefix}clip <search term au URL>\nMfano: ${prefix}clip burna boy last last\nAu: ${prefix}clip https://youtu.be/abc123`);

        try {
            await sock.sendMessage(m.chat, { react: { text: "📥", key: m.key } });

            const query = text.trim();
            let videoLink = null;
            let title = "Downloaded Video";

            // Primary: Public video downloader API (cobalt.tools style au similar worker)
            try {
                // Badilisha na API inayofaa (cobalt.tools au self-hosted yt-dlp worker)
                const apiUrl = `https://cobalt.tools/api/json`; // au equivalent worker
                const response = await axios.post(apiUrl, {
                    url: query.startsWith('http') ? query : `https://youtube.com/results?search_query=${encodeURIComponent(query)}`,
                    isAudioOnly: false,
                    filenamePattern: 'pretty'
                }, { timeout: 20000 });

                videoLink = response.data?.url || response.data?.links?.[0]?.url;
                title = response.data?.title || title;
            } catch (e) {
                console.log("Primary video API failed, trying fallback...");
            }

            // Fallback: Jaribu API nyingine (k.m. ytvdl worker au similar)
            if (!videoLink) {
                try {
                    const fallbackUrl = `https://api.vevioz.com/api/button/mp4/${encodeURIComponent(query)}`; // au API yako
                    const res = await axios.get(fallbackUrl);
                    videoLink = res.data?.url || res.data?.download;
                } catch (e) {}
            }

            if (!videoLink) {
                await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return await reply("❌ Hakuna video iliyopatikana. Jaribu URL au search term sahihi.");
            }

            await sock.sendMessage(m.chat, {
                text: `🎥 *${title}*\n⬇️ Inapakua video MP4...\nSubiri kidogo (inaweza kuchukua muda kulingana na size)`
            }, { quoted: m });

            // Send video (kama ni kubwa sana, tumia document mode)
            await sock.sendMessage(m.chat, {
                video: { url: videoLink },
                mimetype: 'video/mp4',
                fileName: `${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`,
                caption: `🎥 ${title}\nDownloaded via multi-source API`
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error('Clip download error:', error);
            await reply("❌ Download imeshindwa. Jaribu tena au tumia URL moja kwa moja.");
        }
    }
};