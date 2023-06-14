const path = require('path')
const fs = require('fs');

const distDir = path.join(__dirname, '..', 'dist')
const distAssetsDir = path.join(__dirname, '..', 'dist/assets')

function readCssFile() {
    fs.readdirSync(distAssetsDir).forEach(file => {
        console.log(JSON.stringify(file))
        fs.rename(String(distAssetsDir + '/' + file), distAssetsDir + '/tpl-editor.css', () => {
            console.log("\nFile Renamed!\n");
        });
    })
}

readCssFile()
