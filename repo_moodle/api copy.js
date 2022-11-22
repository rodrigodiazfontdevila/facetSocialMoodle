const express = require('express');
const app = express();
const morgan=require('morgan');
const axios = require('axios');
const _ = require('lodash');
// const fs = require('fs');
const conf = require('./config.json');
const { reject, forEach } = require('lodash');

const { token } = require('./configDiscord.json');
const { Client, GatewayIntentBits } = require('discord.js');

let url=conf.baseUrlMoodelServer;
let port=conf.port;
var tokenMoodle = conf.userToken;
var userId = conf.userId;

let getCourses = "core_enrol_get_users_courses";
let getForums = "mod_forum_get_forums_by_courses";
let fn2="mod_forum_get_forum_discussions_paginated";
let fn3="mod_forum_get_forum_discussion_posts";
 
//Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

 //Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

let CursosWhiteList =[];
let ForosWhiteList =[];

async function getCursosWhiteList() {
    const result = await getCurlWithParams(getCourses, "userid", userId);
    result.forEach(element => {
        CursosWhiteList.push(element.id);
    });
}

async function getForosWhiteList() {
    // revisar el get de ger forums sin paramteros 
    const result = await getCurl(getForums);
    result.forEach(element => {
        ForosWhiteList.push(element.id);
    });
}

async function init() {
    getCursosWhiteList();
    getForosWhiteList();
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

function mensajeNuevoPost(element){
    console.log(element.message);
}

async function NuevoPost(responsePost){
    if( CursosWhiteList.includes(Number(responsePost.courseid)) && ForosWhiteList.includes(Number(responsePost.other.forumid)) ){
        const result = await getCurlWithParams(fn3, "discussionid", responsePost.other.discussionid);
        result.posts.forEach(element => {
            if (element.id === responsePost.objectid){
                mensajeNuevoPost(element);
            }
        });
    }
}

async function NuevaDiscusion(responsePost){
    if( CursosWhiteList.includes(Number(responsePost.courseid)) && ForosWhiteList.includes(Number(responsePost.other.forumid)) ){
        const result = await getCurlWithParams(fn3, "discussionid", responsePost.objectid);
        result.posts.forEach(element => {
            if (element.discussion === responsePost.objectid){
                mensajeNuevoPost(element);
            }
        });
    }
}


app.post('/', function(req, res) {
    // elementos.push(req.body.nuevoElemento);
    // res.redirect('/elementos');
    console.log(req.body);
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


init();


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
	} else if (commandName === 'foros') {
		await interaction.reply(`Your foros: ${ForosWhiteList}`);
	} else if (commandName === 'cursos') {
		await interaction.reply(`Your cursos: ${CursosWhiteList}`);
	}
    
});

// client.login(token);

// const channel = client.guilds.cache.get("898578094758170655").channels.cache.get("898578094758170657");
// channel.send('<hola>');
// // client.channels.cache.get('898578094758170657').send(`hola`);
// // console.log(channel)
// // const user = Client.users.cache.get('898578094758170657');
// // user.send('hola');

// const webhookClient = new WebhookClient({ url: 'https://discord.com/api/webhooks/1029871383649460289/7cDiXj1ArSpy-jRvVn_SQWvRW1Rp6McuOT4Ma4GL1RgDSpukEAGY-gMs0EtYzed71prF' });
// //Iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});

