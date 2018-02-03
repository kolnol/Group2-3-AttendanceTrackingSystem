var blockchainModel = require('../models/block.js');
var CryptoJS = require('crypto-js');

    var fs = require('fs');
    var blockchain;
    var rootDB;
    var blockchainPath = __dirname+'/blockchain.json';
    var rootDBPath = __dirname+'/rootdb.json';

    exports.retrieveExistingBlockchain = () => {
        return new Promise((resolve, reject) => {
            if(blockchain) resolve(blockchain)
            else {
                fs.readFile(blockchainPath, 'utf8', function readFileCallback(err, data){
                    if (err){
                        console.log(err);
                    } else {
                        if(!data || data.length < 3) {
                            blockchain = [(getGenesisBlock())]
                            writeToFile(blockchain, blockchainPath)
                            resolve(blockchain);
                        } else {
                            blockchain = JSON.parse(data);
                            resolve(blockchain);
                        }
                    }
                });
            }    
        });
    }

    exports.retrieveRootDB = () => {
        return new Promise((resolve, reject) => {
            if(rootDB) resolve(rootDB);
            else {
                fs.readFile(rootDBPath, 'utf8', (err, data) => {
                    if(err) {
                        console.log(err);
                    } else {
                        if(!data || data.length < 3) {
                            rootDB = new Array();
                            resolve(rootDB);
                        } else {
                            rootDB = JSON.parse(data);
                            resolve(rootDB);
                        }
                    }
                })
            }

        });
    }

    exports.pushBlock = (block) => {
        blockchain.push(block);
        writeToFile(blockchain, blockchainPath)
    }

    exports.pushRootItem = (record) => {
        rootDB.push(record)
        writeToFile(rootDB, rootDBPath);
    }

    exports.reset = () => {
        blockchain = null;
        rootDB = null;
        return Promise.all([writeToFile('', blockchainPath), writeToFile('', rootDBPath)])
    }

    var writeToFile = (data, filePath) => {
        json = JSON.stringify(data, null, 4)
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, json, 'utf8', (sth) => {
                resolve();
            });
        })
    }

    var getGenesisBlock = () => {
        return new blockchainModel.Block(0, "genesis", "0", 1516459421,
                        calculateHash(0, "genesis", "0", 1516459421))
    }

    var calculateHash = (index, attendances, prevHash, timestamp) => {
        return CryptoJS.SHA256(index + attendances + prevHash + timestamp).toString();
    };
