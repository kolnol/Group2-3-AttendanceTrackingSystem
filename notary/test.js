var CryptoJS = require('crypto-js');
var Base64 = require('crypto-js/enc-base64');
var assert = require('assert');


console.log("log me baby");
var hash = CryptoJS.SHA256('4714705859903488' + '5840605766746112').toString();
//var hash = Base64.stringify(hash_temp);
//console.log(hash);



var calculateHash = (index, data, prevHash, timestamp) => {
    return CryptoJS.SHA256(index + data + prevHash + timestamp).toString();
};

console.log(calculateHash(0, "genesis", "0", 1516459421))