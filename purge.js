var loadedDB = require('./loadDatabase');
var saveDB = require('./savetoDatabase');

function purgeInterval() {
  myVar = setInterval(purgeFunc, 600000);
}

function purgeFunc() {
    current = (Date.now()-259200000) //set to 3 days
    expired = (Date.now()-1860000) //set to 10 mins
    for (var i = 0; i < loadedDB.db.Node.length; i++) {
    if (loadedDB.db.Node[i].TimeStamp < current) {
      console.log("Node " + loadedDB.db.Node[i].Id + " has hit 3-day-purge");
      loadedDB.db.Node.splice(i, 1);
      loadedDB.db.Served++;
      saveDB.writeEntry(); 
    }
    else if (loadedDB.db.Node[i].TimeStamp < expired && loadedDB.db.Node[i].isSettled == false) {
        console.log("Invoice for " + loadedDB.db.Node[i].Id + " has expired.");
        loadedDB.db.Node.splice(i, 1);
        saveDB.writeEntry(); 
    }
    }
}

exports.purgeInterval = purgeInterval;
