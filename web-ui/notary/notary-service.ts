import {Observable} from 'rxjs/Rx'
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

enum MessageType {
    FETCH_BLOCKCHAIN = 0,
    RESPONSE_BLOCKCHAIN = 1,
    ADD_BLOCK = 2,
    VERIFY_ATTENDANCE = 3,
    RESPONSE_VERIFICATION = 4
};

enum Result {
    CONFIRMED = "confirmed",
    DENIED = "denied"
};

class Block {
    index: any;
    attendances: any;
    prevHash: any;
    timestamp: any;
    hash: any;

    constructor(index, attendances, prevHash, timestamp, hash) {
        this.index = index;
        this.attendances = attendances;
        this.prevHash = prevHash;
        this.timestamp = timestamp;
        this.hash = hash;
    }
}

@Injectable()
export class NotaryService {
    trusted_ws: WebSocket
    socketPeers = [];
    blockchain: any;
    rootMap = new Map();
    attendanceQueue = new Map();
    attendanceClaimsMap = new Map();
    attendanceResponsesMap = new Map();

    constructor() {
        this.blockchain = [this.getGenesisBlock()];
    }

    connectToPeers = (peers) => {
        peers.forEach(peer => {
            let ws = new WebSocket(peer);
            ws.onopen = () => this.initConnection(ws);
            ws.onerror = () => { 
                console.log("ws connection error")
                this.socketPeers.splice(this.socketPeers.indexOf(ws), 1);
            };
        });
    }

    initConnection = (ws) => {
        console.log('New Connection: ' + ws.url);
        this.socketPeers.push(ws);
        ws.onmessage = message => this.messageHandler(ws, message.data);
        ws.onclose = () => {
            console.log('Close connection');
            this.socketPeers.splice(this.socketPeers.indexOf(ws), 1);
        };
        this.fetchBlockchain()
    }

    messageHandler = (ws, data) => {
        console.log("received data : " + data)
        var message = JSON.parse(data)
    
        switch(message.type) {
            case MessageType.FETCH_BLOCKCHAIN: {
                this.send(ws, this.responseBlockchainMsg());
                break;
            }
            case MessageType.RESPONSE_BLOCKCHAIN: {
                this.handleBlockchain(message.data);
                break;
            }
            case MessageType.ADD_BLOCK: {
                this.handleBlock(message.data)
                break;
            }
            case MessageType.VERIFY_ATTENDANCE: {
                this.handleVerification(message.data)
                break;
            }
            case MessageType.RESPONSE_VERIFICATION: {
                this.handleVerificationResponse(message.data)
                break;
            }
            default: {
                console.log("no case for message: " + JSON.stringify(data));
                break;
            }
        }
    };

    fetchBlockchainMsg = () => ({
        'type': MessageType.FETCH_BLOCKCHAIN
    })
    
    responseBlockchainMsg = () => ({
        'type': MessageType.RESPONSE_BLOCKCHAIN,
        'data': this.blockchain
    });
    
    addBlockMsg = (sessionId) => ({
        'type': MessageType.ADD_BLOCK,
        'data': ({
            'sessionId': sessionId, 
            'block': this.getLatestBlock()
        })
    })
    
    verifyAttendanceMsg = (sessionId, attendance) => ({
        'type': MessageType.VERIFY_ATTENDANCE,
        'data': ({
            'sessionId': sessionId,
            'attendance': attendance
        })
    })
    
    responseVerificationMsg = (sessionId, attendance, result) => ({
        'type': MessageType.RESPONSE_VERIFICATION,
        'data': ({
            'sessionId': sessionId,
            'attendance': attendance,
            'result': result
        })
    })

    responseVerificationResultMsg = (result) => ({
        'result': result
    })
    
    fetchBlockchain = () => {
        console.log("fetch blockchain")
        if(this.socketPeers.length > 0)
            this.send(this.socketPeers[0], this.fetchBlockchainMsg());
        else console.log('no peers available')
    }
    
    handleBlockchain = (data) => {
        this.blockchain = JSON.parse(JSON.stringify(data)).sort((b1, b2) => (b1.index - b2.index));
    }
    
    handleBlock = (data) => {
        console.log("handle block");
        var parsedData = JSON.parse(JSON.stringify(data));
        var sessionId = parsedData.sessionId;
        var nextBlock = parsedData.block;
        console.log("RECEIVED BLOCK" + JSON.stringify(nextBlock))
    
        if(this.isNextBlockValid(nextBlock, this.getLatestBlock())) {
            this.addBlock(sessionId, nextBlock);
        } else {
            this.send(this.socketPeers[0], this.fetchBlockchainMsg())
        }
    }
    
    handleVerification = (data) => {
        var parsedData = JSON.parse(JSON.stringify(data));
        var result = this.verifyAttendance(parsedData.sessionId, parsedData.attendance);
        this.send(this.socketPeers[0], this.responseVerificationMsg(parsedData.sessionId, parsedData.attendance, result));
    }
    
    handleVerificationResponse = (data) => {
        var parsedData = JSON.parse(JSON.stringify(data));
        var sessionId = parsedData.sessionId;
        var attendance = parsedData.attendance;
        var result = parsedData.result;
        var numberOfPeers = this.socketPeers.length;
    
        if(!this.attendanceClaimsMap.get(attendance)) {
            this.attendanceClaimsMap.set(attendance, [])
        }
        this.attendanceClaimsMap.get(attendance).push(result);
    
        if(this.attendanceClaimsMap.get(attendance).length == numberOfPeers){
            if(this.majorityConfirm(attendance)){
                this.attendanceResponsesMap.get(attendance).send(this.responseVerificationResultMsg(Result.CONFIRMED));
            } else {
                this.attendanceResponsesMap.forEach((key, value) => {
                    console.log(key + " = " + value)
                    console.log(attendance)
                })
                this.attendanceResponsesMap.get(attendance).send(this.responseVerificationResultMsg(Result.DENIED));
                this.attendanceResponsesMap.delete(attendance);
            }
        }
    }

    majorityConfirm = (attendance) => {
        var numberOfConfirmations = 0;
        var allResults = this.attendanceClaimsMap.get(attendance);
    
        allResults.forEach(result => {
            if(result) numberOfConfirmations++;
        })
        if(numberOfConfirmations > (allResults.length / 2))
            return true;
    
        return false;
    }

    broadcast = (message) => {
        this.socketPeers.forEach(socket => {
            this.send(socket, message);
        })
    }

    verifyAttendance = (sessionId, attendance) => {
        console.log("verify node");
        if(!this.rootMap.get(sessionId)) return false;
        var blockIndex = this.rootMap.get(sessionId);
        var block = this.blockchain[blockIndex];
        
        if(this.findAttendanceInBlock(attendance, block)){
            return true;
        } else {
            return false;
        }
    }
    
    findAttendanceInBlock = (attendance, block) => {
        var found = block.attendances.find(att => {
            return att == attendance
        });
        if(found) return true;
    
        return false;
    }
    
    calculateHash = (index, attendances, prevHash, timestamp) => {
        return CryptoJS.SHA256(index + attendances + prevHash + timestamp).toString();
    };
    
    getGenesisBlock = () => {
        return new Block(0, "genesis", "0", 1516459421,
                        this.calculateHash(0, "genesis", "0", 1516459421))
    }
    
    calculateHashForBlock = (block) => {
        console.log("next block index: " + block.index);
        console.log("next block attendances: " + block.attendances);
        console.log("next block prevHash: " + block.prevHash);
        console.log("next block timestamp: " + block.timestamp);
        return this.calculateHash(block.index, block.attendances, block.prevHash, block.timestamp);
    }; 
    
    getLatestBlock = () => {
        return this.blockchain[this.blockchain.length - 1];
    }
    
    createNextBlock = (attendances) => {
        var previousBlock = this.getLatestBlock();
    
        var nextIndex = previousBlock.index + 1;
        var prevHash = previousBlock.hash;
        var nextTimestamp = Math.floor(Date.now() / 1000);
        var nextHash = this.calculateHash(nextIndex, attendances, prevHash, nextTimestamp);
    
        return new Block(nextIndex, attendances, prevHash, nextTimestamp, nextHash);
    }
    
    addBlock = (sessionId, block) => {
        this.blockchain.push(block);
        this.rootMap.set(sessionId, block.index);
        console.log("Blockchain size: " + this.blockchain.length);
    }
    
    isNextBlockValid = (nextBlock, prevBlock) => {
        if(prevBlock.index + 1 !== nextBlock.index) {
            console.log("Wrong index");
            return false;
        }
        if(nextBlock.prevHash !== prevBlock.hash) {
            console.log('Wrong prevHash of nextBlock');
            return false;
        }
        if(nextBlock.hash !== this.calculateHashForBlock(nextBlock)) {
            console.log("Wrong hash of nextBlock");
            console.log("Existing hash: " + nextBlock.hash);
            console.log("calculated hash" + this.calculateHashForBlock(nextBlock));
            return false;
        }
        return true;
    }
    
    send = (ws, data) => {
        console.log("send data " + JSON.stringify(data));
        ws.send(JSON.stringify(data));
    }
}