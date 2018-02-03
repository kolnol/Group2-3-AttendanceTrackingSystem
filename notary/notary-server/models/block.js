class Block {
    constructor(index, attendances, prevHash, timestamp, hash) {
        this.index = index;
        this.attendances = attendances;
        this.prevHash = prevHash;
        this.timestamp = timestamp;
        this.hash = hash;
    }
}
module.exports.Block = Block;