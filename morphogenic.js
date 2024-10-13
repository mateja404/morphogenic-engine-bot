const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');

// const token = 'MTI5NTAxNDE0MDUxMDg2MzQyMQ.G42FZd.my1OqLZa2osXqdiIUiEqkhVg3KmaDSVJiyhPlQ'; // pravi
const token = "MTI4MDYyMDk1NjM1NTY1Nzg1MQ.G9tOOj.h2PicraEYyte2Gjzne2-vJYstsbwnjNbLCkqNg"; // test

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Map(); // Inicijalizacija mape za komande

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // Proveri da li je command.data definisan
    if (command.data) {
        console.log(`Registering command: ${command.data.name}`);
        client.commands.set(command.data.name, command);
    } else {
        console.error(`Command in ${file} is missing data property`);
    }
}

client.once('ready', async () => {
    console.log('\x1b[36m%s\x1b[0m', `🚀 Logged in as ${client.user.tag}`);
    console.log('\x1b[36m%s\x1b[0m', `🔍 ${client.user.tag} is currently in servers.`);

    // Registracija svih Slash komandi
    await client.application.commands.set(Array.from(client.commands.values()).map(command => command.data));
    console.log('\x1b[36m%s\x1b[0m', '📜 Slash commands registered successfully!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (!client.commands.has(commandName)) return;

    try {
        await client.commands.get(commandName).execute(interaction, options);
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', '❌ There was an error executing that command:', error);
        await interaction.reply('There was an error executing that command.');
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.includes('slot')) {
        const embed = new EmbedBuilder()
            .setColor('#991846')
            .setTitle('Morphogenic Engine | Rules')
            .setDescription(`
                1. **Respect for Members**: Insulting, provoking, attacking, or disrespecting other server members is not allowed.\n
                2. **Spamming**: Unnecessary spamming or flooding of channels will not be tolerated. Offenders will face temporary bans or permanent bans.\n
                3. **Adult Content**: Adult content is strictly prohibited. Posting explicit material may result in a ban.\n
                4. **Unwanted Messages**: Do not use your presence on the server to send unwanted direct messages to other members.\n
                5. **Communication**: Ex-Yu languages must be used in all interactions, without exceptions.\n
                6. **Interaction with Staff**: Avoid pestering server staff about unresolved reports, complaints, or grievances. All requests will be addressed in due time.\n
                7. **Mentioning Users**: Mentioning other users without a valid reason is not allowed and can be irritating.\n
                8. **Imitating Members**: Imitating any member of the community, whether a regular player or staff, is not permitted.\n
                9. **Advertising**: Advertising services that are not owned by the Founder is not allowed and may lead to an immediate ban without warning.
            `)
            .setTimestamp()
            .setFooter({ 
                text: 'Please follow the rules to maintain a friendly environment!', 
                iconURL: "https://i.ibb.co/25hFrgD/photo-1.jpg" 
            });

        await message.channel.send({ embeds: [embed] });
    }
});

client.login(token);