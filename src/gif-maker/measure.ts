import {createCanvas} from 'canvas';

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
    const lines: string[][] = [];
    let height = 0;
    let width = 0;

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

    let currentLine: string[] = [];
    const lineWidths: number[] = [];

    // height of the last line is the same as for the other lines
    let singleLineHeight: number = 0;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        currentLine.push(word);
        const {width, emHeightAscent} = ctx.measureText(currentLine.join(' '));
        singleLineHeight = emHeightAscent;

        if (width >= maxWidth || i === words.length - 1) {
            lineWidths.push(width);
            lines.push(currentLine);
            currentLine = [];
        }

        if (width >= maxWidth) {
            height += emHeightAscent;
        }
    }

    width = lineWidths.reduce(
        (currentMax, currentWidth) => (currentWidth > currentMax ? currentWidth : currentMax),
        0
    );

    return {
        lines,
        width: Math.round(width + PADDING * 2),
        height: Math.round(height + PADDING * 2),
        lineHeight: singleLineHeight,
        padding: PADDING
    };
};
