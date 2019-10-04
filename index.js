#!/usr/bin/env node

const GIFEncoder = require('gifencoder');
const { createCanvas } = require('canvas');
const fs = require('fs');

const encoder = new GIFEncoder(460, 480);
// stream the results as they are available into myanimated.gif
encoder.createReadStream().pipe(fs.createWriteStream('myanimated.gif'));

encoder.start();
encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
encoder.setDelay(500);  // frame delay in ms
encoder.setQuality(100); // image quality. 10 is default.

// use node-canvas
const canvas = createCanvas(640, 480);
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#ffffff';

ctx.font = "20px Arial";

const strings = ['Привет, Сергей,', 'сделать бота очень просто'];
let x = 20;
let y = 50;
strings.forEach((string) => {
    [...string].forEach((letter) => {
        const width = ctx.measureText(letter).width;
        ctx.fillText(letter, x, y);
        x += width + 5;
        encoder.addFrame(ctx);
    });
    y += 50;
    x = 20;
});

// // red rectangle

// ctx.fillRect(0, 0, 320, 240);
// ctx.measureText("s").width
// encoder.addFrame(ctx);

// // green rectangle
// ctx.fillStyle = '#00ff00';
// ctx.fillRect(0, 0, 320, 240);
// encoder.addFrame(ctx);

// // blue rectangle
// ctx.fillStyle = '#0000ff';
// ctx.fillRect(0, 0, 320, 240);
// encoder.addFrame(ctx);

encoder.finish();