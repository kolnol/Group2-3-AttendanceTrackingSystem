var express = require('express');
var CryptoJS = require('crypto-js')
var bodyParser = require('body-parser')


var http_port = 3000;

var initHttpServer = () => {
    var app = express();
    app.use(bodyParser.json());

    app.post('/addAttendance', function(req, res) {
        // we get hash = e  = sha256(studentId, sessionId) and sessionId
        var sessionId = req.body.sessionId;
        var attendance = req.body.attendance;

        if(!rootMap.get(sessionId)) {
            rootMap.set(sessionId,[attendance]);
        }
        rootMap.get(sessionId).push(attendance);
        console.log(rootMap.get(sessionId).length)

        res.send()
    });
    
    app.post('/addSession', function(req, res){
        if(req.body.state == null || req.body.state == '' ||
           req.body.sessionId == null || req.body.sessionId == '') {
            res.send('Bad request!')
            return;
        }
        var sessionId = req.body.sessionId;

        switch (req.body.state) {
            case 'begin':
                console.log('begin');
                if(rootMap.get(sessionId)) {
                    addBlock(sessionId, rootMap.get(sessionId));                    
                }
                res.send();
                break;
            case 'end':
                console.log('end');
                addBlock();
                res.send();
                break;
            default:
                res.send('Bad request');    
        }
    });

    app.listen(http_port, function () {
        console.log('HTTP Server listening on port: ' + http_port);
    });
}

class Block {
    constructor(index, data, prevHash, timestamp, hash) {
        this.index = index;
        this.data = data;
        this.prevHash = prevHash;
        this.timestamp = timestamp;
        this.hash = hash;
    }
}
var calculateHash = (index, data, prevHash, timestamp) => {
    return CryptoJS.SHA256(index + data + prevHash + timestamp).toString();
};

var getGenesisBlock = () => {
    return new Block(0, "genesis", "0", 1516459421,
                    calculateHash(0, "genesis", "0", 1516459421))
}

var blockchain = [getGenesisBlock()];

var calculateHashForBlock = (block) => {
    return calculateHash(block.index, block.data, block.prevHash, block.timestamp);
}; 

var getLatestBlock = () => {
    blockchain[blockchain.length - 1];
}

var createNextBlock = (blockData) => {
    var previousBlock = getLatestBlock();

    var nextIndex = previousBlock.index + 1;
    var prevHash = previousBlock.hash;
    var nextTimestamp = Math.floor(Date.now() / 1000);
    var nextHash = calculateHash(nextIndex, blockData, prevHash, nextTimestamp);

    return new Block(nextIndex, blockData, prevHash, nextTimestamp);
}

var addBlock = (sessionId, attendances) => {
    console.log('Working')
}

var blocksize_temp = blockchain.length;
var rootMap = new Map();

initHttpServer();