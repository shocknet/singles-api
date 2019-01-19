var grpc = require('grpc');
var fs = require("fs");
const path = require('path');
const os = require( "os" );

//configure lnd connection here
//path.normalize used to simplify configuration on Winderz
//Lnd cert is at /.lnd/tls.cert on Linux and
///Library/Application Support/Lnd/tls.cert on Mac
const home = os.homedir(); 
const certLocation = home + path.normalize('/AppData/Local/Lnd')
const m = fs.readFileSync(home + path.normalize('/AppData/Local/Lnd/data/chain/bitcoin/testnet/admin.macaroon'));
const hostport = "localhost:10009";

var loadedDB = require('./loadDatabase');
var saveDB = require('./savetoDatabase');

// Due to updated ECDSA generated tls.cert we need to let gprc know that
// we need to use that cipher suite otherwise there will be a handhsake
// error when we communicate with the lnd rpc server.
process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'

var macaroon = m.toString('hex')
var metadata = new grpc.Metadata()
metadata.add('macaroon', macaroon)
var macaroonCreds = grpc.credentials.createFromMetadataGenerator((_args, callback) => {
  callback(null, metadata);
});

var lndCert = fs.readFileSync(certLocation + "/tls.cert");
var sslCreds = grpc.credentials.createSsl(lndCert);
var credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);
var lnrpcDescriptor = grpc.load("./rpc.proto");
var lnrpc = lnrpcDescriptor.lnrpc;
var lnd = new lnrpc.Lightning(hostport, credentials);

var request = {};
var call = lnd.subscribeInvoices(request)

call.on('data', function(response) {
  if (response.settle_index === '0') {
    console.log("New Invoice Issued: " + response.payment_request)
  }
  else {
    //iterate through array to find who paid their invoice and update the db
    for (var i = 0; i < loadedDB.db.Node.length; i++) {
      if (loadedDB.db.Node[i].add_index == response.add_index) {
        console.log("Node " + loadedDB.db.Node[i].Id + " has settled their invoice.");
        loadedDB.db.Node[i].isSettled = true;
        saveDB.writeEntry();
      }
    }  
  }  
});

call.on('status', function(status) {
  console.log(status);
});

call.on('end', function() {
  console.log('subscribeInvoices stream ended')
});

module.exports = lnd;