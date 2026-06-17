"use strict";

/**
 * Project: DarkX Ultra
 * Owner: MrX Dev
 * Engineer: Senior Node.js WhatsApp Bot Engineer
 * Configuration File with Session ID Support
 */

module.exports = {
    // --- BASIC BOT INFO ---
    botName: "DarkX Ultra",
    ownerName: "MrX Dev",
    ownerNumber: "255775710774", // Namba yako ya simu bila alama ya +
    prefix: ".", // Alama ya kuanzia amri (mfano: .menu)
    
    // --- SESSION MANAGEMENT ---
    /**
     * Weka Session ID yako hapa chini (Inapaswa kuanza na 'DarkX-Ultra~').
     * Kama unatumia Heroku, iweke kwenye Config Vars kwanza.
     */
    SESSION_ID: process.env.SESSION_ID || "DarkX-Ultra~WEKA_ID_YAKO_HAPA", 
    
    sessionName: "session", // Jina la folder la kuhifadhi login details (Usibadilishe)
    
    // --- BOT MODES & BEHAVIOR ---
    public: true,   // true: Kila mtu anaweza kutumia | false: Ni wewe tu (Self Mode)
    autoread: false, // Je, bot isome meseji zenyewe (Blue tick)?
    online: true,   // Je, bot ionekane iko 'Online' muda wote?
    
    // --- SECURITY & LIMITS ---
    limitCount: 20, // Idadi ya matumizi kwa siku kwa watumiaji wa kawaida
    adminOnly: false, // Ukizima, kila mtu anaweza kutumia bot
    
    // --- VISUALS & METADATA ---
    version: "6.0.0",
    worktype: "public",
    footer: "© 2026 DarkX Ultra - Developed by MrX Dev",
    thumb: "https://telegra.ph/file/a0f3d45e45c71b6d05494.jpg", // Link ya picha ya bot
    
    // --- MESSAGES ---
    msg: {
        owner: "🚫 Amri hii ni kwa ajili ya *MrX Dev* pekee!",
        group: "👥 Samahani, hii amri inafanya kazi kwenye Magroup tu.",
        admin: "👮 Amri hii inahitaji uwe *Admin* wa group.",
        botAdmin: "🤖 Tafadhali nifanye niwe *Admin* kwanza ili nitekeleze hili.",
        wait: "⏳ *DarkX Ultra inashughulikia...* Tafadhali subiri.",
        error: "❌ *Error!* Kuna hitilafu imetokea kwenye mfumo."
    }
};
