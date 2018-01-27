import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class CryptoService {

    constructor(){}

    hash(data) {
        return CryptoJS.SHA256(data).toString();
    }
}