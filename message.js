"use strict";

/**
 * Project: DarkX Ultra
 * Owner: MrX Dev
 * Fix: Enabled command execution for the bot's own number (Self-command)
 */

const config = require("./settings/config");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { synchronizeData } = require("./library/database");

module.exports = async (sock, m, chatUpdate) => {
    try {
        const { type, fromMe, chat, sender, body, pushName } = m;
        
        // --- 1. PARSING SYSTEM ---
        const prefix = config.prefix || '.';
        const isCmd = body?.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : "";
        const args = body?.trim().split(/ +/).slice(1) || [];
        const text = args.join(" ");
        const q = text;

        if (!body) return;

        // --- 2. SELF-RESPONSE LOGIC ---
        // Tunazuia bot kujibu meseji za kawaida (fromMe), LAKINI tunaruhusu kama ni COMMAND.
        if (fromMe && !isCmd) return;

        // Synchronize Database
        if (global.db) synchronizeData(m, sock);

        // --- 3. PERMISSIONS & METADATA ---
        const isGroup = chat.endsWith('@g.us');
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        
        let groupMetadata, participants, groupAdmins, isAdmin, isBotAdmin;
        if (isGroup) {
            groupMetadata = await sock.groupMetadata(chat).catch(() => null);
            if (groupMetadata) {
                participants = groupMetadata.participants || [];
                groupAdmins = participants.filter(v => v.admin !== null).map(v => v.id);
                isAdmin = groupAdmins.includes(sender);
                isBotAdmin = groupAdmins.includes(botId);
            }
        }

        // Namba ya Owner kutoka config
        const ownerJid = (config.ownerNumber.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
        // IsOwner ni kweli kama ni namba ya owner AU kama meseji inatoka kwa bot yenyewe (fromMe)
        const isOwner = fromMe || [ownerJid, botId].includes(sender);

        const reply = (teks) => {
            return sock.sendMessage(chat, { text: teks }, { quoted: m });
        };

        // --- 4. PLUGIN ENGINE ---
        if (isCmd && command) {
            const pluginFolder = path.join(__dirname, "plugins");
            if (!fs.existsSync(pluginFolder)) return;

            const pluginFiles = fs.readdirSync(pluginFolder).filter(file => file.endsWith(".js"));

            for (const file of pluginFiles) {
                try {
                    const filePath = path.join(pluginFolder, file);
                    delete require.cache[require.resolve(filePath)];
                    const plugin = require(filePath);

                    const cmdMatch = Array.isArray(plugin.command) 
                        ? plugin.command.some(c => c.toLowerCase() === command) 
                        : plugin.command?.toLowerCase() === command;

                    if (cmdMatch) {
                        // Pre-execution Security Checks
                        if (plugin.isOwner && !isOwner) return reply(config.msg?.owner || "Owner Only!");
                        if (plugin.isGroup && !isGroup) return reply(config.msg?.group || "Group Only!");
                        if (plugin.isAdmin && !isAdmin) return reply(config.msg?.admin || "Admin Only!");
                        if (plugin.isBotAdmin && !isBotAdmin) return reply(config.msg?.botAdmin || "Make me Admin!");

                        // Execution
                        await plugin.execute(sock, m, {
                            args, text, q, reply, config, chatUpdate, isGroup, 
                            isAdmin, isBotAdmin, isOwner, participants, groupMetadata, pushName, command
                        });
                        return; 
                    }
                } catch (err) {
                    console.error(chalk.red(`[PLUGIN ERROR] ${file}:`), err.message);
                    continue; 
                }
            }
        }
    } catch (err) {
        console.error(chalk.red("CRITICAL ERROR in message.js:"), err);
    }
};
