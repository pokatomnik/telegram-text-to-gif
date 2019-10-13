import {CanvasRenderingContext2D} from 'canvas';

import {Word} from './word';

export class Line {
    private static SPACE_CHARACTER = ' ';

    private readonly words: Array<Word> = [];

    private readonly context: CanvasRenderingContext2D;

    private readonly spaceWord: Word;

    private width = 0;

    private height = 0;

    private descentHeight = 0;

    constructor(ctx: CanvasRenderingContext2D) {
        this.context = ctx;
        this.spaceWord = new Word(this.context, Line.SPACE_CHARACTER);
    }

    public addWord(word: Word) {
        // do not add a space word to the line if this word is the first one
        if (this.words.length) {
            this.words.push(this.spaceWord);
        }
        this.words.push(word);
        this.width = this.words.reduce(
            (width, currentWord) => (width += currentWord.getWidth()),
            0
        );
        this.height = Math.max(this.height, this.spaceWord.getHeight(), word.getHeight());
        this.descentHeight = Math.max.apply(
            null,
            this.words.map((word) => word.getDescentHeight())
        );
    }

    public isEmpty() {
        return !this.words.length;
    }

    public getWords() {
        return this.words;
    }

    public getWidth() {
        return this.width;
    }

    public getSpaceWordWidth() {
        return this.spaceWord.getWidth();
    }

    public getHeight() {
        return this.height;
    }

    public getDescentHeight() {
        return this.descentHeight;
    }
}
