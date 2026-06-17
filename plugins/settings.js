module.exports = {
    command: ['settings', 'config'],
    isOwner: true,
    execute: async (sock, m, { reply }) => {
        const s = global.db.settings;
        const text = `⚙️ *DARKX ULTRA SETTINGS*\n\n` +
                     `🤖 *AI Auto-Reply:* ${s.autoAi ? '✅ ON' : '❌ OFF'}\n` +
                     `🗑️ *Anti-Delete:* ${s.antidelete ? '✅ ON' : '❌ OFF'}\n` +
                     `🌐 *Public Mode:* ${s.public ? '✅ ON' : '❌ OFF'}\n` +
                     `🟢 *Always Online:* ${s.online ? '✅ ON' : '❌ OFF'}\n\n` +
                     `_Tumia amri husika kubadilisha (mfano: .aion)_`;
        await reply(text);
    }
};
