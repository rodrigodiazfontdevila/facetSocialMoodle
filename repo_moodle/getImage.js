const fs = require('fs');
const client = require('https');
const url = `https://facetvirtual.facet.unt.edu.ar/pluginfile.php/1924/user/icon/classic/f2?rev=71264`;
const filepath = `./`;

function downloadImage(url, filepath) {
    client.get(url, (res) => {
        console.log(res)
        // res.pipe(fs.createWriteStream(filepath));
    });
}

downloadImage(url, filepath);