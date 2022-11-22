const axios = require('axios');
const _ = require('lodash');
const fs = require('fs');
const conf = require('./config.json');
const { reject, forEach } = require('lodash');


let url=conf.baseUrlMoodelServer;
let port=conf.port;
var token = conf.userToken;
var userId = conf.userId;

let getCourses="core_enrol_get_users_courses";
let getForums="mod_forum_get_forums_by_courses";
let fn2="mod_forum_get_forum_discussions_paginated";
let fn3="mod_forum_get_forum_discussion_posts";

let cursos;
let foros;
let forosInicio;
let banderaInicio=true;
let dicu;
let post;
// let urlLocal =`http://${url}/webservice/rest/server.php?wstoken=${token}&moodlewsrestformat=json&wsfunction=${fn}&userid=${userId}`;
// let urlFacet =`https://${url}/webservice/rest/server.php?wstoken=${token}&moodlewsrestformat=json&wsfunction=${fn}&userid=${userId}`; 

// console.log(token);
function despues(){

};

function getREST(fn, fileName, cursos, banderaInicio, forosInicio, foros){
    //console.log(`El hub selecionado es: ${hub}`)
    // console.log(`Intentando extraer datos de la api...`)
    //return new Promise((resolve)=>{
        // configurar el hub deseado con el numero
        // console.log(`https://${url}:${port}/webservice/rest/server.php?wstoken=${token}&moodlewsrestformat=json&wsfunction=${fn}&userid=${userId}`)
        axios.get(`http://${url}/webservice/rest/server.php?wstoken=${token}&moodlewsrestformat=json&wsfunction=${fn}&userid=${userId}`, {
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
        
        })
        .then(function (response) {
            // console.log(`Moodle repondio con exito!`);
            console.log(response.data);
            // despues(response.data);
            cursos = response.data;
            // console.log(cursos);
            let data = JSON.stringify(response.data);
            
            fs.writeFileSync(`${fileName}.json`, data);

            // let rawdata = fs.readFileSync(`${fileName}.json`);
            // let pdv = JSON.parse(rawdata);
            // // pdv.forEach(element => {
            // //     // console.log(element.id)
            // //     hubCurl2(fn2,element);
            // // });

            // hubCurl1(getForums, banderaInicio , forosInicio , foros);
            // console.log(`Los datos obtenidos de moodle son:`);
            // console.log(pdv);
            // getREST(getCourses, "cursos",  cursos,banderaInicio, forosInicio, foros);
            //resolve(pdv)
        })
        .catch(function (error) {
            console.log(`Ocurrio un error al comunicarse con la api`);
            //reject(error);
            console.log(error);
        })
        .then(function () {
            // always executed
        });

    //}) 
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  } 
  

async function hubCurl1(fn, banderaInicio, forosInicio ,foros){
    //console.log(`El hub selecionado es: ${hub}`)
    // console.log(`Intentando extraer datos de la api...`)
    //return new Promise((resolve)=>{
        // configurar el hub deseado con el numero
        axios.get(`http://${url}:${port}/webservice/rest/server.php?wstoken=${token}&moodlewsrestformat=json&wsfunction=${fn}`, {
        /*headers: {'token': conf.token, 'hubname' : hub},*/

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
        
        })
        .then(async function (response) {
            // console.log(`Moodle repondio con exito!`);
            //console.log(response.data);
            
            // console.log(foros);
            let data = JSON.stringify(response.data);
            fs.writeFileSync(`foros.json`, data);
            if (banderaInicio) {
                console.log(`Cambio bandera`)
                banderaInicio=false;
                forosInicio = response.data;
            }
            else{
                forosInicio = foros;
            }
            foros = response.data;
            foros.forEach(element => {
                
                forosInicio.forEach(element2 => {
                    // console.log(element2);
                    
                    // console.log(Number(element.timemodified) )
                    // console.log(Number(element2.timemodified) )
                    if( element.id == element2.id){
                        console.log(`Comparo el foro id: ${element.id} name: ${element.name} fecha: ${element.timemodified}`);
                        console.log(`Con     el foro id: ${element2.id} name: ${element2.name} fecha: ${element2.timemodified}`);
                        if ( Number(element.timemodified) > Number(element2.timemodified) )
                        {
                            console.log(`Se modifico la fecha del foro id: ${element.id} name: ${element.name} fecha: ${element.timemodified}`);
                        }
                    }
                    
                  });
              });

              console.log(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`);
            let rawdata = fs.readFileSync(`foros.json`);
            let pdv = JSON.parse(rawdata);
            pdv.forEach(element => {
                // console.log(element.id)
                // hubCurl2(fn2,element);
            });
            // console.log(`Los datos obtenidos de moodle son:`);
            // console.log(pdv);

            //resolve(pdv)
            await delay(10000);
            console.log('This printed after about 1 second');
            setTimeout(function() {
            }, 3000000);
            hubCurl1(getForums, banderaInicio , forosInicio , foros);
        })
        .catch(function (error) {
            console.log(`Ocurrio un error al comunicarse con la api`);
            //reject(error);
            console.log(error);
        })
        .then(function () {
            // always executed
        });

    //}) 
}

function hubCurl2(fn,foros){
    //console.log(`El hub selecionado es: ${hub}`)
    // console.log(`Intentando extraer datos de la api...`)
    //return new Promise((resolve)=>{
        // configurar el hub deseado con el numero
        axios.get(`http://${url}:${port}/webservice/rest/server.php?wstoken=${token}&moodlewsrestformat=json&wsfunction=${fn}&forumid=${foros.id}`, {
        /*headers: {'token': conf.token, 'hubname' : hub},*/

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
        
        })
        .then(function (response) {
            // console.log(`Moodle repondio con exito!`);
            //console.log(response.data);
            let data = JSON.stringify(response.data);
            fs.writeFileSync(`discusiones_courseId=${foros.course}_forumid=${foros.id}.json`, data);

            let rawdata = fs.readFileSync(`discusiones_courseId=${foros.course}_forumid=${foros.id}.json`);
            let pdv2 = JSON.parse(rawdata);

            pdv2.discussions.forEach(element => {
                // console.log(element.id)
                hubCurl3(fn3,element.discussion);
            });

            //  console.log(`Los datos obtenidos de moodle son:`);
            //console.log(pdv2);

            //resolve(pdv)
        })
        .catch(function (error) {
            console.log(`Ocurrio un error al comunicarse con la api`);
            //reject(error);
            console.log(error);
        })
        .then(function () {
            // always executed
        });

    //}) 
} 


function hubCurl3(fn,idDiscusion){
    //console.log(`El hub selecionado es: ${hub}`)
    // console.log(`Intentando extraer datos de la api...`)
    //return new Promise((resolve)=>{
        // configurar el hub deseado con el numero
        axios.get(`http://${url}:${port}/webservice/rest/server.php?wstoken=${token}&moodlewsrestformat=json&wsfunction=${fn}&discussionid=${idDiscusion}`, {
        /*headers: {'token': conf.token, 'hubname' : hub},*/

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
        
        })
        .then(function (response) {
            // console.log(`Moodle repondio con exito!`);
            //console.log(response.data);
            let data = JSON.stringify(response.data);
            fs.writeFileSync(`posts_discussionid=${idDiscusion}.json`, data);

            // let rawdata = fs.readFileSync(`${fn}&discussionid=${idDiscusion}.json`);
            // let pdv3 = JSON.parse(rawdata);
            
            
            // console.log(`Los datos obtenidos de moodle son:`);
            // console.log(pdv);

            //resolve(pdv)
        })
        .catch(function (error) {
            console.log(`Ocurrio un error al comunicarse con la api`);
            //reject(error);
            console.log(error);
        })
        .then(function () {
            // always executed
            setTimeout(function() {
            }, 30000);
            getREST(getCourses, "cursos",  cursos,banderaInicio, forosInicio, foros);
        });

    //}) 
} 


hubCurl1(getForums, banderaInicio , forosInicio , foros);

// getREST(getCourses, "cursos",  cursos,banderaInicio, forosInicio, foros);
// console.log(foros);

// for

// let rawdata = fs.readFileSync(`cursos.json`);
// let cursos = JSON.parse(rawdata);
// cursos.forEach(element => {
//     // console.log(element.id)
//     hubCurl1(getForums,element);
// });

// hubCurl1(getForums);



/*
async function generarArchivoHosts(agenciasJSON){
    // await hubCurl()
    var indiceLote=1;
    var loteHost=1;
    var indiceCantidaHosts=0;
    var tamLote=conf.tamLote;
    
    
    console.log("Creando inventario de ansible");
    console.log(`El lote sera de ${tamLote} hosts como maximo`);

    //Obtenego json a partir de una archivo y filtro los datos
    fs.readFile(agenciasJSON, function(err, data) {
        // Check for errors
        if (err) throw err;
        // Converting to JSON
        const agencias = JSON.parse(data);
        //una vez obtenido el json se procede a filtrar
        _.filter(agencias , function(o){
            const string1 = '^vpn[0-9]{4}.*pc[0-9]{2}$';
            const string2 = '^172';
            const regexp1 = new RegExp(string1);
            const regexp2 = new RegExp(string2);
            if ( regexp1.test(o["User Name"]) && regexp2.test(o["IP Address"]) ){  
                if ( o["IP Address"] ){
                    //myConsole.log(o["User Name"])
                    if ( indiceLote > tamLote ) {
                        indiceLote=0;
                        loteHost++;
                        myConsole.log(`\n[puntosventa${loteHost}]`); 
                    }
                    indiceLote++;
                    indiceCantidaHosts++;
                    return myConsole.log(`${o["IP Address"].toString().padEnd(14, ' ')}   #${o["User Name"]}  N${indiceCantidaHosts}`); 
                }
            }
        })
    });

    //Creacion de archivo hosts a partir de un template
    fs.copyFile('hosts.template', 'hosts', (err) => {
        if (err) throw err;
        console.log(`Archivo de ansible con los hosts generado`);
    }); 
    
    //Escritura sobre el archivo hosts 
    const myConsole = new console.Console(fs.createWriteStream('./hosts', { flags: 'a'}, function(err){
        if (err) {
            return console.error(err);
        }
    }));
    
} 

generarArchivoHosts(fileName);
*/