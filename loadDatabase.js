const fs = require('fs');
const path = require('path');
const os = require( "os" );

const home = os.homedir(); 
const databaseLocation = home + path.normalize('/Shock/singles.json')

console.log(databaseLocation)

var db = JSON.parse(fs.readFileSync('./singles.json', 'utf8'));

exports.databaseLocation = databaseLocation;
exports.db = db;
