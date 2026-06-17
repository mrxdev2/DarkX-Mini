module.exports = {
    command: ["viewonce", "vv", "vo"],
    execute: async (sock, m, args) => {
        try {
            // Tunatafuta kama kuna meseji iliyokuwa quoted
            const quoted = m.msg?.contextInfo?.quotedMessage;
            if (!quoted) return sock.sendMessage(m.chat, { text: "Reply kwenye picha au video ya view-once!" });

            const viewOnceMedia = quoted.viewOnceMessageV2?.message?.imageMessage || 
                                  quoted.viewOnceMessageV2?.message?.videoMessage ||
                                  quoted.imageMessage || 
                                  quoted.videoMessage;

            if (!viewOnceMedia || (!viewOnceMedia.viewOnce && !quoted.viewOnceMessageV2)) {
                return sock.sendMessage(m.chat, { text: "Hii siyo media ya view-once!" });
            }

            await sock.sendMessage(m.chat, { react: { text: "📸", key: m.key } });

            // Tunatumia function ya download iliyopo kwenye sock (index.js)
            const buffer = await sock.downloadMediaMessage({ 
                msg: viewOnceMedia, 
                mtype: viewOnceMedia.mimetype.split('/')[0] + 'Message' 
            });

            const caption = viewOnceMedia.caption || "Nimekunasa! 😂";

            if (viewOnceMedia.mimetype.includes('image')) {
                await sock.sendMessage(m.chat, { image: buffer, caption }, { quoted: m });
            } else if (viewOnceMedia.mimetype.includes('video')) {
                await sock.sendMessage(m.chat, { video: buffer, caption }, { quoted: m });
            }

        } catch (error) {
            console.error('Error in viewonce:', error);
            await sock.sendMessage(m.chat, { text: "❌ Imefeli kufungua view-once." });
        }
    }
};
