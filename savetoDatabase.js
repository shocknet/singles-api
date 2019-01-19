const fs = require('fs');
var loadedDB = require('./loadDatabase');



function writeEntry(){
    fs.writeFile('./singles.json', JSON.stringify(loadedDB.db, null, 2), function (err) {
        if (err) return console.log(err);
        console.log('writing to singles.json');
    });
}

exports.writeEntry = writeEntry;
