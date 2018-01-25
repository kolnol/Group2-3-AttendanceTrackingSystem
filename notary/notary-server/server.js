var express = require('express');
var CryptoJS = require('crypto-js');
var bodyParser = require('body-parser');
var WebSocket = require('ws');

const MessageType = {
    FETCH_BLOCKCHAIN: 0,
    RESPONSE_BLOCKCHAIN: 1,
    ADD_BLOCK: 2,
    VERIFY_ATTENDANCE: 3,
    RESPONSE_VERIFICATION: 4
};

const Result = {
    CONFIRMED: "confirmed",
    DENIED: "denied"
}

var http_port = 3000;
var ws_port = 5000;
var socketPeers = [];

var initP2PServer = () => {
    wss = new WebSocket.Server({port: ws_port});    
    wss.on('connection', ws => initConnection(ws));
    wss.on('error', () => {
        console.log("ws connection error")
        socketPeers.splice(socketPeers.indexOf(ws), 1);
    });
    console.log('WS Server listening on port: ' + ws_port);
}

var initConnection = (ws) => {
    console.log('New Connection: ' + ws.url);
    socketPeers.push(ws);
    ws.on('message', message => messageHandler(ws, message));
    ws.on('close', () => {
        console.log('Close connection');
        socketPeers.splice(socketPeers.indexOf(ws), 1);
    });
    //fetchBlockchain(ws, fetchBlockchainMsg())
}

var messageHandler = (ws, data) => {
    var message = JSON.parse(data)

    switch(message.type) {
        case MessageType.FETCH_BLOCKCHAIN:
            send(ws, responseBlockchainMsg());
            break;
        case MessageType.RESPONSE_BLOCKCHAIN:
            handleBlockchain(message.data);
            break;
        case MessageType.ADD_BLOCK:
            handleBlock(message.data)
            break;
        case MessageType.VERIFY_ATTENDANCE:
            handleVerification(message.data)
            break;
        case MessageType.RESPONSE_VERIFICATION:
            handleVerificationResponse(message.data)
            break;
    }
};

var fetchBlockchainMsg = () => ({
    'type': MessageType.FETCH_BLOCKCHAIN
})

var responseBlockchainMsg = () => ({
    'type': MessageType.RESPONSE_BLOCKCHAIN,
    'data': blockchain
});

var addBlockMsg = (sessionId) => ({
    'type': MessageType.ADD_BLOCK,
    'data': ({
        'sessionId': sessionId, 
        'block': getLatestBlock()
    })
})

var verifyAttendanceMsg = (sessionId, attendance) => ({
    'type': MessageType.VERIFY_ATTENDANCE,
    'data': ({
        'sessionId': sessionId,
        'attendance': attendance
    })
})

var responseVerificationMsg = (sessionId, attendance, result) => ({
    'type': MessageType.RESPONSE_VERIFICATION,
    'data': ({
        'sessionId': sessionId,
        'attendance': attendance,
        'result': result
    })
})

var responseVerificationResultMsg = (result) => ({
    'result': result
})

var fetchBlockchain = () => {
    console.log("fetch blockchain")
    if(socketPeers.length > 0)
        send(socketPeers[0], fetchBlockchainMsg());
    else console.log('no peers available')
}

var handleBlockchain = (data) => {
    blockchain = JSON.parse(JSON.stringify(data)).sort((b1, b2) => (b1.index - b2.index));
}

var handleBlock = (data) => {
    console.log("handle block");
    var parsedData = JSON.parse(JSON.stringify(data));
    var sessionId = parsedData.sessionId;
    var nextBlock = parsedData.block;
    console.log("RECEIVED BLOCK" + JSON.stringify(nextBlock))

    if(isNextBlockValid(nextBlock, getLatestBlock())) {
        addBlock(sessionId, nextBlock);
    } else {
        send(socketPeers[0], fetchBlockchainMsg())
    }
}

var handleVerification = (data) => {
    var parsedData = JSON.parse(JSON.stringify(data));
    var result = verifyAttendance(parsedData.sessionId, parsedData.attendance);
    send(socketPeers[0], responseVerificationMsg(parsedData.sessionId, parsedData.attendance, result));
}

var handleVerificationResponse = (data) => {
    var parsedData = JSON.parse(JSON.stringify(data));
    var sessionId = parsedData.sessionId;
    var attendance = parsedData.attendance;
    var result = parsedData.result;
    var numberOfPeers = socketPeers.length;

    if(!attendanceClaimsMap.get(attendance)) {
        attendanceClaimsMap.set(attendance, [])
    }
    attendanceClaimsMap.get(attendance).push(result);

    if(attendanceClaimsMap.get(attendance).length == numberOfPeers){
        if(majorityConfirm(attendance)){
            attendanceResponsesMap.get(attendance).send(responseVerificationResultMsg(Result.CONFIRMED));
        } else {
            attendanceResponsesMap.forEach((key, value) => {
                console.log(key + " = " + value)
                console.log(attendance)
            })
            attendanceResponsesMap.get(attendance).send(responseVerificationResultMsg(Result.DENIED));
            attendanceResponsesMap.delete(attendance);
        }
    }

}

var majorityConfirm = (attendance) => {
    var numberOfConfirmations = 0;
    var allResults = attendanceClaimsMap.get(attendance);

    allResults.forEach(result => {
        if(result) numberOfConfirmations++;
    })
    if(numberOfConfirmations > (allResults.length / 2))
        return true;

    return false;
}

var broadcast = (message) => {
    socketPeers.forEach(socket => {
        send(socket, message);
    })
}

var connectToPeers = (peers) => {
    peers.forEach(peer => {
        ws = new WebSocket(peer);
        ws.on('open', () => initConnection(ws));
        ws.on('error', () => {
            console.log("ws connection error")
            socketPeers.splice(socketPeers.indexOf(ws), 1);
        });
    });
}

var initHttpServer = () => {
    var app = express();
    app.use(bodyParser.json());

    app.post('/addAttendance', function(req, res) {
        // we get hash = e  = sha256(studentId, sessionId) and sessionId
        var sessionId = req.body.sessionId;
        var attendance = req.body.attendance;

        if(!attendanceQueue.get(sessionId)) {
            res.send('Session ' + sessionId + ' does not exist!');
            return;
        } else {
            attendanceQueue.get(sessionId).push(attendance);
        }

        console.log(attendanceQueue.get(sessionId).length)

        res.status(200).send("OK");
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
                // check wheather someone tries to add attendance to already existing session
                if(blockId = rootMap.get(sessionId)) {
                    if(blockId <= getLatestBlock().index) {
                        res.send("Block for session " + sessionId + " already exists!");
                        return;
                    }
                }
                if(attendanceQueue.get(sessionId)) {
                    res.send('Session already began!');                    
                } else {
                    attendanceQueue.set(sessionId, []);
                    res.status(200).send("OK");
                }
                break;
            case 'end':
                console.log('end');
                if(attendances = attendanceQueue.get(sessionId)) {
                    addBlock(sessionId, createNextBlock(attendances));
                    broadcast(addBlockMsg(sessionId));
                    attendanceQueue.delete(sessionId);                    
                }
                res.status(200).send("OK");
                break;
            default:
                res.send('Bad request');    
        }
    });

    app.get('/verifyAttendance', function(req, res){
        verifyAttendanceMaster(Number(req.query.sessionId), req.query.attendance, res)
    });

    app.get('/', function(req, res) {
        res.send('Notary blockchain')
    });

    app.listen(http_port, function () {
        console.log('HTTP Server listening on port: ' + http_port);
    });
}

class Block {
    constructor(index, attendances, prevHash, timestamp, hash) {
        this.index = index;
        this.attendances = attendances;
        this.prevHash = prevHash;
        this.timestamp = timestamp;
        this.hash = hash;
    }
}

var verifyAttendanceMaster = (sessionId, attendance, res) => {
    if(!rootMap.get(sessionId)){
        res.send('No sessionId: ' + sessionId + " found.");
        return false;
    }
    var blockIndex = rootMap.get(sessionId);
    var block = blockchain[blockIndex];

    if(false || findAttendanceInBlock(attendance, block)){
        res.send(responseVerificationResultMsg(Result.CONFIRMED));
    } else {
        if(socketPeers.length == 0) {
            console.log("no peers")
            res.send(responseVerificationResultMsg(Result.DENIED))
        } else {
            console.log("ASK OTHERS");
            broadcast(verifyAttendanceMsg(sessionId, attendance));
            attendanceResponsesMap.set(attendance, res);
        }
    }

}

var verifyAttendance = (sessionId, attendance) => {
    console.log("verify node");
    if(!rootMap.get(sessionId)) return false;
    var blockIndex = rootMap.get(sessionId);
    var block = blockchain[blockIndex];
    
    if(findAttendanceInBlock(attendance, block)){
        return true;
    } else {
        return false;
    }
}

var findAttendanceInBlock = (attendance, block) => {
    var found = block.attendances.find(att => {
        return att == attendance
    });
    if(found) return true;

    return false;
}

var calculateHash = (index, attendances, prevHash, timestamp) => {
    return CryptoJS.SHA256(index + attendances + prevHash + timestamp).toString();
};

var getGenesisBlock = () => {
    return new Block(0, "genesis", "0", 1516459421,
                    calculateHash(0, "genesis", "0", 1516459421))
}

var blockchain = [getGenesisBlock()];

var calculateHashForBlock = (block) => {
    console.log("next block index: " + block.index);
    console.log("next block attendances: " + block.attendances);
    console.log("next block prevHash: " + block.prevHash);
    console.log("next block timestamp: " + block.timestamp);
    return calculateHash(block.index, block.attendances, block.prevHash, block.timestamp);
}; 

var getLatestBlock = () => {
    return blockchain[blockchain.length - 1];
}

var createNextBlock = (attendances) => {
    var previousBlock = getLatestBlock();

    var nextIndex = previousBlock.index + 1;
    var prevHash = previousBlock.hash;
    var nextTimestamp = Math.floor(Date.now() / 1000);
    var nextHash = calculateHash(nextIndex, attendances, prevHash, nextTimestamp);

    return new Block(nextIndex, attendances, prevHash, nextTimestamp, nextHash);
}

var addBlock = (sessionId, block) => {
    blockchain.push(block);
    rootMap.set(sessionId, block.index);
    console.log("Blockchain size: " + blockchain.length);
}

var isNextBlockValid = (nextBlock, prevBlock) => {
    if(prevBlock.index + 1 !== nextBlock.index) {
        console.log("Wrong index");
        return false;
    }
    if(nextBlock.prevHash !== prevBlock.hash) {
        console.log('Wrong prevHash of nextBlock');
        return false;
    }
    if(nextBlock.hash !== calculateHashForBlock(nextBlock)) {
        console.log("Wrong hash of nextBlock");
        console.log("Existing hash: " + nextBlock.hash);
        console.log("calculated hash" + calculateHashForBlock(nextBlock));
        return false;
    }
    return true;
}

var send = (ws, data) => {
    ws.send(JSON.stringify(data));
}

var blocksize_temp = blockchain.length;

var rootMap = new Map();
var attendanceQueue = new Map();
var attendanceClaimsMap = new Map();
var attendanceResponsesMap = new Map();

initHttpServer();
initP2PServer();
//connectToPeers(['ws://ec2-34-240-13-114.eu-west-1.compute.amazonaws.com:5000/']);
//fetchBlockchain();
