# Rotom Bot

Rotom Bot is a Discord bot designed to simplify team drafting for tournaments. Built using **JavaScript**, **Node.js**, and APIs from **Discord** and **Google Cloud**, it enables teams to draft their Pokémon directly through Discord, with picks automatically updated on a shared Google Sheet for transparency and planning.

---

## 🚀 Features

- Draft Pokémon via Discord using a simple command format.
- Automatically updates selections to Google Sheets in real-time.
- Helps teams strategize by making all picks visible and accessible.

---

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rotom-bot.git
   cd rotom-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file and include the following:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   GOOGLE_API_KEY=your_google_api_key
   SHEET_ID=your_google_sheet_id
   ```

4. **Run the bot**
   ```bash
   node index.js
   ```

## 📘 Usage

When a team is ready to draft, they use the following command in Discord:


![image](https://github.com/user-attachments/assets/ffbf93ef-af97-4d0c-9de7-5b3b2ff2ec4d)



The command requires a team number followed by a comma-separated list of 10 Pokémon ("mons"). The bot will then update the shared Google Sheet in real time.

---**Output:**

![image](https://github.com/user-attachments/assets/6c081fbe-b0d3-4b3a-a3ec-47dd618588b5)


---
