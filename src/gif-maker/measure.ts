import {createCanvas} from 'canvas';

import {VirtualCanvas} from './virtual-canvas';

export const getContext = (fillStyle: string, font: string) => ({
    simple() {
        return this.withSizes(0, 0);
    },
    withSizes(width: number = 0, height: number = 0) {
        const ctx = createCanvas(width, height).getContext('2d');
        ctx.fillStyle = fillStyle;
        ctx.font = font;

        return ctx;
    }
});

// Max allowed characters amount
const MAX_STRING_LENGTH = 200;
const SPACE_CHARACTER = ' ';
const PADDING = 50;

interface Params {
    font: string;
    fillStyle: string;
    text: string;
    maxWidth: number;
}

export const getSizesAndLines = ({
    font,
    fillStyle,
    text: rawText,
    maxWidth: rawMaxWidth
}: Params) => {
    // create canvas for measurements with zero size
    const ctx = getContext(fillStyle, font).simple();

    /**
     * Getting text with no spaces at start and at the end and convert all
     * space characters to regular spaces
     */
    const text = rawText.trim().replace(/\s\s+/g, SPACE_CHARACTER);

    let maxWidth = rawMaxWidth;

    if (text.length > MAX_STRING_LENGTH) {
        throw new Error('Text is too long');
    }

    const words = text.split(SPACE_CHARACTER);

    const longestWordWidth = words.reduce((currentMax, currentWord) => {
        const currentWordWidth = ctx.measureText(currentWord).width;
        return currentWordWidth > currentMax ? currentWordWidth : currentMax;
    }, 0);

    if (longestWordWidth > rawMaxWidth) {
        maxWidth = longestWordWidth;
    }

    const virtualCanvas = new VirtualCanvas(ctx, maxWidth);

    words.forEach((word) => {
        virtualCanvas.addWord(word);
    });

    return virtualCanvas.finalizeAndGet();
};
