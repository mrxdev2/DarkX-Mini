"use strict";

/**
 * Project: DarkX Ultra
 * Owner: MrX Dev
 * Engineer: Senior Node.js WhatsApp Bot Engineer
 * Optimized index.js for performance, stability, and memory safety.
 */

const config = require('./settings/config');
const fs = require('fs');
const path = require('path');
const { Buffer } = require('buffer');
const pino = require('pino');
const readline = require("readline");
const chalkImport = require("chalk");
const chalk = chalkImport.default || chalkImport;

const { smsg } = require('./library/serialize');
const { getBotResponse } = require('./library/brain');

// Process optimization
process.on("uncaughtException", (err) => {
    console.error(chalk.red("CRITICAL ERROR (Uncaught Exception):"), err);
});

process.on("unhandledRejection", (reason) => {
    console.error(chalk.red("CRITICAL ERROR (Unhandled Rejection):"), reason);
});

// Dynamic Baileys Imports
let makeWASocket,
    Browsers,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    jidDecode,
    delay,
    makeCacheableSignalKeyStore;

const loadBaileys = async () => {
    try {
        const baileys = await import('@whiskeysockets/baileys');

        makeWASocket = baileys.default;
        Browsers = baileys.Browsers;
        useMultiFileAuthState = baileys.useMultiFileAuthState;
        DisconnectReason = baileys.DisconnectReason;
        fetchLatestBaileysVersion = baileys.fetchLatestBaileysVersion;
        jidDecode = baileys.jidDecode;
        delay = baileys.delay;
        makeCacheableSignalKeyStore = baileys.makeCacheableSignalKeyStore;

    } catch (e) {
        console.error(chalk.red("Failed to load Baileys library:"), e);
        process.exit(1);
    }
};

// Global state
let autoAi = false;

const sessionName = config.sessionName || 'session';
const sessionPath = path.join(__dirname, sessionName);

const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(chalk.yellow(text), (answer) => {
            resolve(answer);
            rl.close();
        });
    });
};

const clientstart = async () => {

    await loadBaileys();

    // SESSION ID MANAGEMENT
    const sessId = process.env.SESSION_ID || config.SESSION_ID;

    if (
        sessId &&
        sessId.startsWith("DarkX-Ultra~") &&
        !fs.existsSync(path.join(sessionPath, 'creds.json'))
    ) {

        console.log(chalk.blue("🚀 Session ID detected. Initializing session folder..."));

        if (!fs.existsSync(sessionPath)) {
            fs.mkdirSync(sessionPath, { recursive: true });
        }

        try {

            const base64Data = sessId.split("DarkX-Ultra~")[1];

            fs.writeFileSync(
                path.join(sessionPath, 'creds.json'),
                Buffer.from(base64Data, 'base64').toString('utf-8')
            );

        } catch (e) {
            console.log(chalk.red("❌ Session ID is corrupt!"));
        }
    }

    // AUTH STATE
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const { version, isLatest } = await fetchLatestBaileysVersion();

    console.log(
        chalk.gray(
            `WhatsApp Web Version: ${version.join('.')} (Latest: ${isLatest})`
        )
    );

    // SOCKET
    const sock = makeWASocket({
        logger: pino({ level: "silent" }),

        printQRInTerminal: false,

        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(
                state.keys,
                pino({ level: "silent" })
            ),
        },

        version,

        browser: Browsers.ubuntu("Chrome"),

        markOnlineOnConnect: true,

        generateHighQualityLinkPreview: true,

        getMessage: async () => ({
            conversation: 'DarkX-Ultra-Internal-Cache'
        })
    });

    // PAIRING CODE
    if (!sock.authState.creds.registered) {

        console.log(
            chalk.cyan(`\n--- ${config.botName} Pairing System ---`)
        );

        let phoneNumber = await question(
            'Ingiza namba ya simu (mfano: 2557XXXXXXXX):\n> '
        );

        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

        if (phoneNumber) {

            try {

                await delay(3000);

                const code = await sock.requestPairingCode(phoneNumber);

                const formattedCode =
                    code?.match(/.{1,4}/g)?.join("-") || code;

                console.log(
                    chalk.white('\nPairing Code Yako Ni: ') +
                    chalk.bold.green(formattedCode)
                );

                console.log(
                    chalk.gray(
                        "Ingiza kodi hii kwenye WhatsApp yako sasa hivi.\n"
                    )
                );

            } catch (error) {

                console.error(
                    chalk.red('Failed to request pairing code:'),
                    error.message
                );
            }
        }
    }

    // SAVE CREDS
    sock.ev.on('creds.update', saveCreds);

    // CONNECTION UPDATE
    sock.ev.on('connection.update', (update) => {

        const { connection, lastDisconnect } = update;

        if (connection === 'connecting') {
            console.log(chalk.yellow('🔄 Connecting to WhatsApp...'));
        }

        if (connection === 'open') {

            console.log(
                chalk.green(
                    `✅ ${config.botName} Imeunganishwa kikamilifu!`
                )
            );

            console.log(
                chalk.cyan(`👤 Owner: ${config.ownerName}`)
            );
        }

        if (connection === 'close') {

            const statusCode =
                lastDisconnect?.error?.output?.statusCode;

            const reason =
                new Error(lastDisconnect?.error)?.message;

            const shouldReconnect =
                statusCode !== DisconnectReason.loggedOut;

            console.log(
                chalk.red(
                    `❌ Connection closed. Reason: ${reason || statusCode}`
                )
            );

            if (shouldReconnect) {

                console.log(
                    chalk.yellow(
                        '🔄 Attempting to reconnect in 5 seconds...'
                    )
                );

                setTimeout(clientstart, 5000);

            } else {

                console.log(
                    chalk.red(
                        '🚫 Session Logged Out. Please clear session folder and restart.'
                    )
                );

                process.exit(1);
            }
        }
    });

    // MESSAGE EVENT
    sock.ev.on('messages.upsert', async (chatUpdate) => {

        try {

            if (chatUpdate.type !== 'notify') return;

            const mek = chatUpdate.messages[0];

            if (!mek?.message) return;

            // HANDLE EPHEMERAL & VIEWONCE
            const msgType = Object.keys(mek.message)[0];

            if (
                msgType === 'ephemeralMessage' ||
                msgType === 'viewOnceMessage' ||
                msgType === 'viewOnceMessageV2'
            ) {
                mek.message = mek.message[msgType].message;
            }

            const m = smsg(sock, mek);

            const body = m.body || "";

            const isOwner =
                m.key.fromMe ||
                config.ownerNumber?.includes(
                    m.sender.split('@')[0]
                );

            // =========================
            // AUTO VIEW STATUS
            // =========================
            if (m.chat === 'status@broadcast') {

                try {

                    // AUTO VIEW
                    await sock.readMessages([mek.key]);

                    // AUTO REACT
                    if (config.autoReact) {

                        const reactions = [
                            '🔥',
                            '💎',
                            '⚡',
                            '❤️',
                            '✨',
                            '🤖',
                            '🚀'
                        ];

                        const randomReaction =
                            reactions[
                                Math.floor(
                                    Math.random() * reactions.length
                                )
                            ];

                        await sock.sendMessage(
                            'status@broadcast',
                            {
                                react: {
                                    text: randomReaction,
                                    key: mek.key
                                }
                            },
                            {
                                statusJidList: [m.sender]
                            }
                        );
                    }

                } catch (statusError) {
                    console.log(
                        chalk.red(
                            "Status react/view error:"
                        ),
                        statusError.message
                    );
                }

                return;
            }

            // =========================
            // AUTO READ CHAT
            // =========================
            if (config.autoRead) {
                await sock.readMessages([mek.key]);
            }

            // =========================
            // AUTO TYPING
            // =========================
            if (config.autoTyping) {
                await sock.sendPresenceUpdate(
                    'composing',
                    m.chat
                );
            }

            // =========================
            // AUTO RECORDING
            // =========================
            if (config.autoRecording) {
                await sock.sendPresenceUpdate(
                    'recording',
                    m.chat
                );
            }

            // =========================
            // AUTO REACT NORMAL CHAT
            // =========================
            if (
                config.autoReact &&
                !m.isBaileys &&
                !m.key.fromMe
            ) {

                const emojis = [
                    '⚡',
                    '✨',
                    '💎',
                    '🚀',
                    '🤖'
                ];

                const randomEmoji =
                    emojis[
                        Math.floor(
                            Math.random() * emojis.length
                        )
                    ];

                await sock.sendMessage(
                    m.chat,
                    {
                        react: {
                            text: randomEmoji,
                            key: m.key
                        }
                    }
                );
            }

            // =========================
            // AI TOGGLE
            // =========================
            if (body === ".aion" && isOwner) {

                autoAi = true;

                return await sock.sendMessage(
                    m.chat,
                    {
                        text:
                            "✅ *DarkX AI:* Auto-Reply is now ON!"
                    },
                    { quoted: m }
                );
            }

            if (body === ".aioff" && isOwner) {

                autoAi = false;

                return await sock.sendMessage(
                    m.chat,
                    {
                        text:
                            "📴 *DarkX AI:* Auto-Reply is now OFF!"
                    },
                    { quoted: m }
                );
            }

            // =========================
            // AI REPLY
            // =========================
            if (
                autoAi &&
                body &&
                !m.key.fromMe &&
                !m.isGroup
            ) {

                const aiResponse = getBotResponse(body);

                if (aiResponse) {

                    await sock.sendMessage(
                        m.chat,
                        { text: aiResponse },
                        { quoted: m }
                    );
                }
            }

            // =========================
            // MAIN HANDLER
            // =========================
            require("./message")(sock, m, chatUpdate);

        } catch (err) {

            console.error(
                chalk.red("Error in message event loop: "),
                err
            );
        }
    });

    // JID DECODE
    sock.decodeJid = (jid) => {

        if (!jid) return jid;

        if (/:\d+@/gi.test(jid)) {

            let decode = jidDecode(jid) || {};

            return (
                decode.user &&
                decode.server &&
                decode.user + '@' + decode.server
            ) || jid;

        } else {
            return jid;
        }
    };

    return sock;
};

// START BOT
clientstart().catch(err =>
    console.error("Startup Failure:", err)
);