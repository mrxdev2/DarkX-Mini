# 🎭 DARKX-MINI WHATSAPP BOT

<p align="center">
  <img src="https://files.catbox.moe/pc5uec.png" width="200" height="200" alt="DarkX Logo">
</p>

<p align="center">
  <a href="https://github.com/darkx-pro/DarkX-Mini/fork"><img src="https://img.shields.io/badge/FORK-REPO-blue?style=for-the-badge&logo=github" alt="Fork"></a>
  <a href="https://github.com/darkx-pro/DarkX-Mini/stargazers"><img src="https://img.shields.io/badge/STAR-REPO-yellow?style=for-the-badge&logo=github" alt="Stars"></a>
</p>

---

## 🚀 NJIA ZA KU-DEPLOY

### 1. HEROKU (Njia Rahisi)
Bonyeza button hapa chini kuanza ku-deploy moja kwa moja kwenye Heroku.

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://dashboard.heroku.com/new?template=https://github.com/darkx-pro/DarkX-Mini)

---

## 🔑 JINSI YA KUPATA SESSION ID
Kabla ya ku-deploy, unahitaji **Session ID**. Fuata hatua hizi:

1.  Fungua tovuti hii: [**SMD Pairing Site**](https://smd-pair.zone.id/pair)
2.  Ingiza namba yako ya WhatsApp (mfano: `255775710774`).
3.  Ingiza **Pairing Code** utakayopokea kwenye WhatsApp yako.
4.  Baada ya kufanikiwa, utatumiwa kodi ndefu inayoanza na `SMD~`.

### ⚠️ MUHIMU: Badilisha Jina la Session
Bot yetu inatambua kodi inayozanza na jina la **DarkX-Ultra**. Fanya hivi:
* **Kodi uliyopata:** `SMD~eyJub2lzZ...`
* **Badilisha iwe:** `DarkX-Ultra~eyJub2lzZ...`
*(Futa tu neno `SMD` na weka `DarkX-Ultra` kabla ya alama ya `~`)*.

---

### 2. DEPLOY KWENYE PANEL (Pterodactyl/VPS)
Kama unatumia Panel au VPS, tumia amri hizi kwenye Console:

```bash
# 1. Clone Repo
git clone [https://github.com/darkx-pro/DarkX-Mini.git](https://github.com/darkx-pro/DarkX-Mini.git)

# 2. Ingia kwenye folder
cd DarkX-Mini

# 3. Install Module muhimu
npm install

# 4. Washa Bot
npm start
