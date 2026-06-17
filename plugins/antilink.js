const config = require("../settings/config");
const { 
    verifierEtatJid, 
    recupererActionJid, 
    mettreAJourAction, 
    ajouterOuMettreAJourJid 
} = require("../bdd/antilien");
const { resetWarnCountByJID } = require("../bdd/warn");

module.exports = {
    command: ["antilink", "antiurl", "antilien"],
    category: "group",
    execute: async (sock, m, { args, reply, isGroup, isAdmin, isOwner }) => {
        try {
            // 1. Validation
            if (!isGroup) {
                return reply("❌ This command only works in groups.");
            }

            if (!isAdmin && !isOwner) {
                return reply("❌ Only group admins or the bot owner can use this command.");
            }

            const subCommand = args[0]?.toLowerCase();
            const actionType = args[1]?.toLowerCase();
            const prefix = config.prefix;

            // ========== ENABLE ANTI-LINK ==========
            if (subCommand === "on") {
                await ajouterOuMettreAJourJid(m.chat, 'oui');
                await mettreAJourAction(m.chat, 'warn'); // Default to warn
                
                return reply(`╭━━━〔 *RAHMANI-XMD* 〕━━━╮\n┃\n┃ 🔗 *ANTI-LINK ACTIVATED*\n┃\n┃ ✅ Status: *ENABLED*\n┃ ⚙️ Mode: *3-Strike Rule (Warn)*\n┃\n┃ 📌 Bot must be admin to delete links.\n┃\n╰━━━〔 𓆩☠︎︎𓆪 𝙈𝙧𝙓 𝘿𝙚𝙫𝙚𝙡𝙤𝙥𝙚𝙧 😈 〕━━━╯`);
            }
            
            // ========== DISABLE ANTI-LINK ==========
            else if (subCommand === "off") {
                await ajouterOuMettreAJourJid(m.chat, 'non');
                return reply(`╭━━━〔 *RAHMANI-XMD* 〕━━━╮\n┃\n┃ 🔗 *ANTI-LINK DEACTIVATED*\n┃\n┃ ❌ Status: *DISABLED*\n┃ 📌 Links are now allowed.\n┃\n╰━━━〔 𓆩☠︎︎𓆪 𝙈𝙧𝙓 𝘿𝙚𝙫𝙚𝙡𝙤𝙥𝙚𝙧 😈 〕━━━╯`);
            }
            
            // ========== CHANGE ACTION ==========
            else if (subCommand === "action") {
                let dbAction = '';
                let actionDisplay = '';

                if (actionType === 'delete') {
                    dbAction = 'supp';
                    actionDisplay = 'Delete Only';
                } else if (actionType === 'warn') {
                    dbAction = 'warn';
                    actionDisplay = '3-Strike Rule (Warn)';
                } else if (actionType === 'remove' || actionType === 'kick') {
                    dbAction = 'remove';
                    actionDisplay = 'Remove Immediately';
                } else {
                    return reply(`❌ Usage: \`${prefix}antilink action delete/warn/remove\``);
                }

                await mettreAJourAction(m.chat, dbAction);
                return reply(`✅ Anti-link action set to: *${actionDisplay}*`);
            }
            
            // ========== RESET WARNINGS ==========
            else if (subCommand === "reset") {
                const targetJid = m.msg.contextInfo?.participant || (args[1] ? args[1].replace('@', '') + '@s.whatsapp.net' : null);
                
                if (!targetJid) return reply("❌ Please reply to a message or mention a user to reset warnings.");
                
                await resetWarnCountByJID(targetJid);
                return reply(`✅ Warnings reset for @${targetJid.split('@')[0]}`, { mentions: [targetJid] });
            }
            
            // ========== CHECK STATUS (DEFAULT) ==========
            else {
                const etat = await verifierEtatJid(m.chat);
                const dbAction = await recupererActionJid(m.chat);
                
                let actionDisplay = dbAction === 'supp' ? 'Delete Only' : (dbAction === 'remove' ? 'Remove Immediately' : '3-Strike Rule');
                const statusText = etat ? "✅ ENABLED" : "❌ DISABLED";

                const menu = `╭━━━〔 *RAHMANI-XMD* 〕━━━╮
┃
┃ 🛡️ *ANTI-LINK SETTINGS*
┃
┃ 📊 *Status:* ${statusText}
┃ ⚙️ *Action:* ${actionDisplay}
┃
┃ ━━━━━━━━━━━━━━━━━━━
┃
┃ 📌 *Commands:*
┃ 🔹 ${prefix}antilink on (Enable)
┃ 🔹 ${prefix}antilink off (Disable)
┃ 🔹 ${prefix}antilink action [delete/warn/remove]
┃ 🔹 ${prefix}antilink reset @user
┃
┃ ⚠️ *Bot must be admin to function!*
┃
╰━━━〔 𓆩☠︎︎𓆪 𝙈𝙧𝙓 𝘿𝙚𝙫𝙚𝙡𝙤𝙥𝙚𝙧 😈 〕━━━╯`;
                
                return reply(menu);
            }

        } catch (error) {
            console.error("Antilink Command Error:", error);
            reply("❌ Error managing antilink settings.");
        }
    }
};
