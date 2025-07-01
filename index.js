const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

require('dotenv').config();
const token = process.env.TOKEN;
const clientId = '1389170853312335994';
const guildId = '1311698083863724123';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const command = new SlashCommandBuilder()
    .setName('tailieutoan') // ✅ không dấu, không khoảng trắng
    .setDescription('Vào đây coi Tài Liệu') // ✅ có thể có tiếng Việt ở đây
  .toJSON();

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Đăng ký slash command...');
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: [command] }
    );
    console.log('✅ Slash command đã sẵn sàng!');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'tailieutoan') {
    await interaction.reply('👉 [Tài liệu đây nì, bấm vào đê](https://docs.google.com/spreadsheets/d/1cQFGIJYsRkHCCP7QjKU_39ycCnoaUjQtYBSmJ_jeJHU/edit?usp=sharing)');
  }
});

client.on('ready', () => {
  console.log(`✅ Bot đã đăng nhập với tên ${client.user.tag}`);
});

client.login(token);
