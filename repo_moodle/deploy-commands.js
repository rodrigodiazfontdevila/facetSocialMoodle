const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./configDiscord.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
    new SlashCommandBuilder().setName('cursos').setDescription('Replies with cursos!'),
    new SlashCommandBuilder().setName('foros').setDescription('Replies with foros!'),
	new SlashCommandBuilder().setName('create-channel').setDescription('Creates a channels!'),
	new SlashCommandBuilder().setName('create-embed').setDescription('Creates a webhook!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);