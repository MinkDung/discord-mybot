const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const fetch = require('node-fetch');
const { parse } = require('csv-parse/sync');

const token = process.env.TOKEN;
const clientId = '1389170853312335994';
const guildId = '1311698083863724123';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Slash command: /tailieutoan
const command = new SlashCommandBuilder()
  .setName('tailieutoan')
  .setDescription('Gửi danh sách tài liệu từ Google Sheet')
  .toJSON();

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('🔁 Đang đăng ký slash command...');
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: [command] }
    );
    console.log('✅ Slash command đã sẵn sàng!');
  } catch (error) {
    console.error(error);
  }
})();

// Hàm tải và parse CSV từ Google Sheet
async function getLinksFromCSV() {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/1cQFGIJYsRkHCCP7QjKU_39ycCnoaUjQtYBSmJ_jeJHU/export?format=csv&gid=0';
  const res = await fetch(csvUrl);
  const text = await res.text();
  const records = parse(text, { columns: false, skip_empty_lines: true });
  return records.map(r => `🔗 ${r[0]} - ${r[1]}`).join('\n');
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'tailieutoan') {
    const msg = await getLinksFromCSV();
    await interaction.reply(msg || 'Không tìm thấy tài liệu nào 😕');
  }
});

client.on('ready', () => {
  console.log(`✅ Bot đã đăng nhập với tên ${client.user.tag}`);
});

client.login(token);
