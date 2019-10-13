#!/usr/bin/env node

import fs from 'fs';

import {GIFMaker} from './src/gif-maker';

const gifMaker = new GIFMaker({
    maxWidth: 150,
    font: '24px Arial'
});

const textToDraw = process.argv[2]
    ? process.argv[2]
    : 'The quick brown fox jumps over the lazy dog';

console.log(`Drawing "${textToDraw}"`);
try {
    gifMaker.writeTo(textToDraw, fs.createWriteStream('myanimated.gif'));
    console.log('Successfully completed');
} catch (e) {
    console.error(e);
}
