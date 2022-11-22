const { token } = require('./configDiscord.json');
const { guildId } = require('./configDiscord.json');
const { Client, GatewayIntentBits, messageLink } = require('discord.js');




// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	} else if (commandName === 'create-channel') {
		const guild = client.guilds.cache.get(guildId);
		// guild.channels.create({
		// 	name: "hello",
		// 	type: ChannelType.GuildText,
		// 	parent: cat[0].ID,
		// 	// your permission overwrites or other options here
		// });
		// guild.channel
		guild.channels.create({ name: 'nuevo-canal-texto', reason: 'Needed a cool new channel' })
        .then(console.log)
        .catch(console.error);
		// interaction.
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
});
// const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// client.on('ready', () => {
//     console.log('Bot Now connected!');
//     console.log('Logged In as', client.user.tag)
//     client.user.setStatus('dnd'); // online, idle, invisible, dnd

//     console.log('Bot status: ', client.user.presence.status);

//     // Bot sending a Message to a text channel called test
//     // const testChannel = client.channels.find(x => x.name === 'test')
//     // console.log(testChannel)
//     // client.channels.find(c => c.name === 'test').send('Hello Server!')

// });

// Bot listenning messages
// client.on('message', msg => {
//     console.log(msg.content)
//     if (msg.content === 'ping') {
//         msg.reply('pong')
//     }

//     if (msg.content === 'hello') {
//         msg.channel.send(`Hello ${msg.author}`);
//     }

//     if (msg.content.includes('!test')) {
//         msg.channel.send('Glad you are testing');
//     }

//     if (msg.content === '!fazt') {
//         msg.channel.send('https://youtube.com/fazttech');
//         msg.channel.send('https://youtube.com/faztcode');
//     }

//     if (msg.content === '!pretty') {
//         const embed = new RichEmbed()
//             // .setTitle('A pretty message')
//             // .setColor(0xFF0000)
//             // .setDescription('Hello', msg.author);
//             .addField('Something One', 'Some content', true)
//             .addField('Something Two', 'Some content Two', true)
//             .addField('Something Three', 'Some content Three', false)
//             .setAuthor('Fazt', 'https://pngimage.net/wp-content/uploads/2018/05/code-logo-png-4.png');
//         msg.channel.send(embed);
//     }

//     // Deleting 100 messages
//     if (msg.content.startsWith('!clean')) {
//         async function clear() {
//             try {
//                 // await msg.delete();
//                 const fetched = await msg.channel.fetchMessages({limit: 99});
//                 msg.channel.bulkDelete(fetched);;
//                 console.log('Messages deleted');
//             }
//             catch (e) {
//                 console.log(e);
//             }
//         }
//         clear();
//     }
// });

client.login(token);