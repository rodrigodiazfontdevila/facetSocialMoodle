const express = require('express');
const app = express();
const morgan=require('morgan');
const axios = require('axios');
// const fs = require('fs');
const conf = require('./config.json');
const { reject, forEach } = require('lodash');

const { token } = require('./configDiscord.json');
const { guildId } = require('./configDiscord.json');
const { Client, GatewayIntentBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js')

const { convert } = require('html-to-text');
const fs = require('fs');

const nodeHtmlToImage = require('node-html-to-image')
 

// const guild = client.guilds.cache.get("YOUR_GUILD_ID")

let url=conf.baseUrlMoodelServer;
var tokenMoodle = conf.userToken;
var userId = conf.userId;

let getCourses = "core_enrol_get_users_courses";
let getForums = "mod_forum_get_forums_by_courses";
let fn3="mod_forum_get_forum_discussion_posts";
 
//Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

 //Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

let CursosWhiteList =[];
let tableCourses =[];
let tableBdCursos =[];
let ForosWhiteList =[];
let tableForums =[];
let tableBdForos = require(`./tableBdForos.json`);



async function getCursosWhiteList() {
    const result = await getCurlWithParams(getCourses, "userid", userId);
    result.forEach(element => {
        const bdCurso = {
            id: element.id,
            shortname: element.fullname,
            fullname: element.fullname,
            IdCategoryDiscord: null,
        };
        tableBdCursos.push(bdCurso);
        tableCourses.push(element);
        CursosWhiteList.push(element.id);
    });
    var jsonContent = JSON.stringify(tableBdForos);
    // console.log(jsonContent);
    
    fs.writeFile("tableBdCursos.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });
}


function add(tableBdForos, obj, id) {
    // const { length } = arr;
    // const id = length + 1;
    console.log(id);
    console.log(tableBdForos);
    tableBdForos.forEach(elem => {
        console.log("Comp id: " + elem.id + "Con:" + id);
        if (elem.id === id){
            console.log("si estaba");
        }
    });
    // const duplicate = tableBdForos.some(el => el.id === id);
    // console.log(duplicate);
    // if (duplicate) {
    //     console.log("si estaba");
    //     if (duplicate.IdChannelDiscord == null) tableBdForos.push(obj);
    // };
    // return tableBdForos;
}

async function getForosWhiteList() {
    // revisar el get de ger forums sin paramteros 
    const result = await getCurl(getForums);
    result.forEach(element => {
        const bdForo = {
            id: element.id,
            course: element.course,
            type: element.type,
            name: element.name,
            intro: element.intro,
            IdChannelDiscord: null,
        };
        // console.log(element.id);
        add(tableBdForos, bdForo, element.id );
        // tableBdForos.push(bdForo);
        ForosWhiteList.push(element.id);
        tableForums.push(element);
    });


    // var jsonObj = JSON.parse(tableForums);
    // console.log(jsonObj);
    
    // stringify JSON Object


    // var jsonContent = JSON.stringify(tableBdForos);
    // console.log(jsonContent);
    
    // fs.writeFile("tableBdForos.json", jsonContent, 'utf8', function (err) {
    //     if (err) {
    //         console.log("An error occured while writing JSON Object to File.");
    //         return console.log(err);
    //     }
    
    //     console.log("JSON file has been saved.");
    // });
}

async function init(tableBdForos) {
    // if (fs.existsSync(`./tableBdForos.json`)) {
    //     // Do something
    //     let rawdata = fs.readFileSync('tableBdForos.json');
    //     tableBdForos = JSON.parse(rawdata);
    //     console.log(tableBdForos);
    // }


        // Convert fs.readFile into Promise version of same    
        // const readFile = util.promisify(fs.readFile);

        // function getStuff() {
        //     data = readFile('tableBdForos.json');
        //     tableBdForos = JSON.parse(data);
        //     return;
        // }

        // // Can't use `await` outside of an async function so you need to chain
        // // with then()
        // getStuff().then(data => {
        console.log(tableBdForos);
        // console.log(data);
        getCursosWhiteList();
        getForosWhiteList();
        // })

    
    
}

async function getCurl(fn){
    const response = await axios.get(`http://${url}/webservice/rest/server.php?wstoken=${tokenMoodle}&moodlewsrestformat=json&wsfunction=${fn}`, {
    headers: {
        // 'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'es-ES,es;q=0.9',
        'cache-control': 'max-age=0',
        'sec-ch-ua': '\'Google Chrome\';v=\'105\', \'Not)A;Brand\';v=\'8\', \'Chromium\';v=\'105\'',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '\'Windows\'',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1'
    },

    });

    if (response.data) {
        // console.log(response.data);
        datosRespuesta = response.data;
        // console.log(datosRespuesta);
        return datosRespuesta;
    }
    else return null;
        
}

async function getCurlWithParams(fn, parametro, valorParametro){
    const response = await axios.get(`http://${url}/webservice/rest/server.php?wstoken=${tokenMoodle}&moodlewsrestformat=json&wsfunction=${fn}&${parametro}=${valorParametro}`, {
    headers: {
        // 'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'es-ES,es;q=0.9',
        'cache-control': 'max-age=0',
        'sec-ch-ua': '\'Google Chrome\';v=\'105\', \'Not)A;Brand\';v=\'8\', \'Chromium\';v=\'105\'',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '\'Windows\'',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1'
    },

    });

    if (response.data) {
        // console.log(response.data);
        datosRespuesta = response.data;
        // console.log(datosRespuesta);
        return datosRespuesta;
    }
    else return null;
        
}

function CreateEmbed(guildId, channelId, element ){
    const html = element.message;
    const text = convert(html, {
        wordwrap: 130
    });
    console.log(element);
    const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle(element.subject)
    // .setURL(`http://${url}mod/forum/discuss.php?d=${element.discussion}`)
	.setURL(`http://localhost/webservice/pluginfile.php/32/user/icon/f1?token=7d35397a131f64bb11b111fe82c5736b`)
	.setAuthor({ name: element.userfullname, iconURL: 'http://localhost/webservice/pluginfile.php/32/user/icon/f1?token=7d35397a131f64bb11b111fe82c5736b', url: 'https://discord.js.org' })
	.setDescription(text)
	.setThumbnail('http://localhost/webservice/pluginfile.php/32/user/icon/f1?token=7d35397a131f64bb11b111fe82c5736b')
	// .addFields(
	// 	{ name: 'Regular field title', value: 'Some value here' },
	// 	{ name: '\u200B', value: '\u200B' },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// )
	// .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	// .setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	// .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
    client.guilds.fetch(guildId).then(guild => guild.channels.cache.get(channelId).send({ embeds: [exampleEmbed] }));
}

async function DiscordSendMessage(guildId, channelId, element){
    const html = element.message;
    const text = convert(html, {
        wordwrap: 130
    });
    const stringMensage = `**__${element.subject}__**\nPublicado por: ` + "`" +`${element.userfullname}` + "`" + `\n\n${text}\n═════════════════\n`;
    console.log(channelId);
    console.log(element);
    client.guilds.fetch(guildId).then(guild => guild.channels.cache.get(channelId).send(stringMensage));
    // CreateEmbed(guildId, channelId, element);
    // client.guilds.fetch(guildId).then(guild => guild.channels.cache.get(channelId).send({ embeds: [exampleEmbed] }));
}

function mensajeNuevoPost(element, idforo){
    console.log(element.message);
    console.log(tableBdForos);
    const foundForo = tableBdForos.find(foro => foro.id == idforo);
    // client.guilds.fetch(guildId).then(guild => guild.channels.cache.get(foundForo.IdChannelDiscord).send(element.message));
    DiscordSendMessage(guildId, foundForo.IdChannelDiscord, element);
}

async function NuevoPost(responsePost){
    let idforo = Number(responsePost.other.forumid);
    console.log("Cuersos: " + CursosWhiteList);
    console.log("foros: " + ForosWhiteList);
    if( CursosWhiteList.includes(Number(responsePost.courseid)) && ForosWhiteList.includes(Number(responsePost.other.forumid)) ){
        const result = await getCurlWithParams(fn3, "discussionid", responsePost.other.discussionid);
        result.posts.forEach(element => {
            if (element.id === responsePost.objectid){
                mensajeNuevoPost(element, idforo);
            }
        });
    }
}

async function NuevaDiscusion(responsePost){
    // console.log(responsePost);
    if( CursosWhiteList.includes(Number(responsePost.courseid)) && ForosWhiteList.includes(Number(responsePost.other.forumid)) ){
        const result = await getCurlWithParams(fn3, "discussionid", responsePost.objectid);
        result.posts.forEach(element => {
            if (element.discussion === responsePost.objectid){
                // console.log(element);
                mensajeNuevoPost(element, responsePost.other.forumid);
            }
        });
    }
}


app.post('/', function(req, res) {
    // elementos.push(req.body.nuevoElemento);
    // res.redirect('/elementos');
    // console.log(req);
    res.json(
        {
            "Title": "Hola mundo"
        }
    );
    switch (req.body.token) {
        case "post_created":
          NuevoPost(req.body);
          break;
        case "discussion_created":
            NuevaDiscusion(req.body);
          break;
        default:
          //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
          break;
    }
});

app.get('/cursos', (req, res) => {
    res.send(CursosWhiteList);
});


init(tableBdForos);


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
    // let guild = message.guild;
    var array = [];
    let channels = client.channels.cache;
    // console.log(channels);
    // console.log(channels);
    for (const channel of channels.values()) 
    {
      array.push(channel.id);
    //   console.log(`Id: ${channel.id}  name: ${channel.name}`);
    }
    // client.guilds.fetch(guildId).then(guild => guild.channels.create({ name: "Name", type: guild.GuildCategory }));
    // const guild = client.guilds.cache.get(guildId);
    // const categoryChannels = guild.channels.filter(channel => channel.type === "category");
    // categoryChannels.forEach(channel => {
    //     console.log(`Category ${channel.name} has ${channel.children.size} channels`);
    // });

//   const channel2 = client.channels.cache.get('1024666597333418104');
// console.log(channel2);
    // const channel = client.channels.cache;
    // console.log(channel);
});


function crearCanales() {
    return new Promise(resolve => {
        const guild = client.guilds.cache.get(guildId);
        tableBdForos.forEach(foro => {
            console.log(foro.IdChannelDiscord == null);
            if ( foro.IdChannelDiscord == null) {
                const found = tableCourses.find(element2 => element2.id == foro.course);
                guild.channels.create({ name: `${found.fullname}-${foro.name}`, reason: 'Needed a cool new channel' })
                .then(result => {
                    // console.log('Here is channel id', result.id)
                    console.log(`Id: ${result.id}  name: ${result.name}`);
                    foro.IdChannelDiscord = result.id;

                    var jsonContent = JSON.stringify(tableBdForos);
                    // console.log(jsonContent);
        
                    fs.writeFile("tableBdForos.json", jsonContent, 'utf8', function (err) {
                        if (err) {
                            console.log("An error occured while writing JSON Object to File.");
                            return console.log(err);
                        }
                    
                        console.log("JSON file has been saved.");
                    })

                    // console.log(element.IdChannelDiscord);
                    
                    //create another channel here
                    })
                .catch(console.error);
            }
            resolve('resolved');
        });
        
    });
  }

// async function crearCanales() {
//     console.log('calling');
//   const result = await resolveAfter2Seconds();
//   console.log(result);
//   tableCourses.forEach(element2 => {
//     console.log(element2.IdChannelDiscord);
// })
//   // expected output: "resolved"
    
// }

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	} else if (commandName === 'foros') {
		await interaction.reply(`Your foros: ${ForosWhiteList}`);
	} else if (commandName === 'cursos') {
		await interaction.reply(`Your cursos: ${CursosWhiteList}`);
	} else if (commandName === 'create-channel') {

        
        // tableCourses.forEach(element1 => {
        //     console.log(`${element1.fullname}`);
        // });


		// const guild = client.guilds.cache.get(guildId);
        // tableCourses.forEach(element => {
        //     guild.channels.create({ name: `${element.fullname}`, reason: 'Needed a cool new channel' })
        //     .then(result => {
        //         // console.log('Here is channel id', result.id)
        //         console.log(`Id: ${result.id}  name: ${result.name}`);
        //         element.IdChannelDiscord = result.id;
        //         console.log(element.IdChannelDiscord);

        //         //create another channel here
        //         })
        //     .catch(console.error);
        // });
        // console.log(tableCourses);
        await crearCanales();
       
		
		await interaction.reply(`Your channels: ${tableCourses.fullname} where created`);

	}
    else if (commandName === 'create-embed') {
        
         
		// const html = element.message;
        // const text = convert(html, {
        //     wordwrap: 130
        // });
        // console.log(element);
        const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle("titulo")
        // .setURL(`http://${url}mod/forum/discuss.php?d=${element.discussion}`)
        .setURL(`https://via.placeholder.com/256`)
        .setAuthor({ name: "name", iconURL: 'https://via.placeholder.com/256', url: 'https://discord.js.org' })
        .setDescription("cuerpo del post")
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        // .addFields(
        // 	{ name: 'Regular field title', value: 'Some value here' },
        // 	{ name: '\u200B', value: '\u200B' },
        // 	{ name: 'Inline field title', value: 'Some value here', inline: true },
        // 	{ name: 'Inline field title', value: 'Some value here', inline: true },
        // )
        // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
        // .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        // .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        client.guilds.fetch(guildId).then(guild => guild.channels.cache.get('1041111634489380884').send({ embeds: [exampleEmbed] }));
		await interaction.reply(`Your webhook: ${tableCourses.fullname} where created`);
	}
    
});

client.login(token);

// const channel = client.guilds.cache.get("898578094758170655").channels.cache.get("1040052004455727124");
// channel.send('<hola>');

// // const user = Client.users.cache.get('898578094758170657');
// // user.send('hola');

// const webhookClient = new WebhookClient({ url: 'https://discord.com/api/webhooks/1029871383649460289/7cDiXj1ArSpy-jRvVn_SQWvRW1Rp6McuOT4Ma4GL1RgDSpukEAGY-gMs0EtYzed71prF' });
// //Iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});

