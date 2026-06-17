module.exports = {
    command: ['antidelete'],
    isOwner: true,
    execute: async (sock, m, { args, reply }) => {
        if (!args[0]) return reply("Tumia hivi: .antidelete on/off");

        if (args[0] === 'on') {
            global.db.settings.antidelete = true;
            await reply("✅ Anti-Delete is now on.");
        } else if (args[0] === 'off') {
            global.db.settings.antidelete = false;
            await reply("✅ Anti-Delete is now off.");
        }
    }
};
