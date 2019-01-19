var express = require('express');
var router = express.Router();
var validateIP = require('validate-ip-node');
var lnd = require('../lnd')
var loadedDB = require('../loadDatabase');
var saveDB = require('../savetoDatabase');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/shill', async (req, res) => {
  let checkIdLength = req.body.Id;
  let checkIP = validateIP(req.body.Ip);
  let checkPort = Number.isInteger(req.body.Port);
  if (typeof checkIdLength === undefined || checkIdLength.length != 66 || checkIP != true || checkPort != true || typeof req.body.Wumbo != "boolean") {
    res.status(400).send('Invalid value(s) detected');
  }
  else try {
    getInvoice().then(challengeInvoice => {
      res.status(200).send(challengeInvoice.payment_request);
      var entry = {
        "Id": req.body.Id,
        "Ip": req.body.Ip,
        "Port": req.body.Port,
        "Why": req.body.Why,
        "Wumbo": req.body.Wumbo,
        "TimeStamp": Date.now(),
        "add_index": challengeInvoice.add_index,
        "isSettled": false,
      }
      loadedDB.db.Node.push(entry);
      saveDB.writeEntry();
    })
  } catch(e) {console.log(e)} 
})

function getInvoice() {
  return new Promise( (resolve, reject) => {
    lnd.addInvoice({memo: "Lightning Singles Validation", value: 100, expiry: 1800}, (err, result) => {
      if(err) {
         reject(err);
      }
      else{
        resolve(result)
      }
   }); 
 });
}

router.get('/api/list', function (req, res) {
  results = loadedDB.db.Node.filter(function(entries){return (entries.isSettled==true);});
  res.status(200).send(results);
})


module.exports = router;
