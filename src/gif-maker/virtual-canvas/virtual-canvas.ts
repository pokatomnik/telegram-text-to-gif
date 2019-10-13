import {CanvasRenderingContext2D} from 'canvas';
import {NotFinalized, Finalizable} from '../../common/finalizable';

import {Word} from './word';
import {Line} from './line';

export interface Measurements {
    lines: Array<Array<string>>;
    width: number;
    height: number;
    lineHeight: number;
}

export class VirtualCanvas extends Finalizable {
    private readonly context: CanvasRenderingContext2D;
    private readonly maxWidth: number;
    private readonly lines: Array<Line> = [];

    private currentLine: Line;

    constructor(ctx: CanvasRenderingContext2D, maxWidth: number) {
        super();
        this.context = ctx;
        this.currentLine = new Line(this.context);
        this.maxWidth = maxWidth;
    }

    private finalizeCurrentLine() {
        this.lines.push(this.currentLine);
        this.currentLine = new Line(this.context);
    }

    @NotFinalized
    public addWord(word: string) {
        const currentLineWidth = this.currentLine.getWidth();
        const newWord = new Word(this.context, word);
        const newWordAndSpaceWidth =
            this.currentLine.getWidth() + this.currentLine.getSpaceWordWidth() + newWord.getWidth();

        const totalWidth = currentLineWidth + newWordAndSpaceWidth;

        if (totalWidth >= this.maxWidth) {
            this.finalizeCurrentLine();
        }

        this.currentLine.addWord(newWord);

        return this;
    }

    @NotFinalized
    public finalizeAndGet(): Measurements {
        if (!this.currentLine.isEmpty()) {
            this.finalizeCurrentLine();
        }

        const lines = this.lines.map((line) =>
            line
                .getWords(Line.requireNoSpaces)
                .map((word) => word.getWord())
                .join(' ')
                .split('')
        );
        const width = Math.round(
            this.lines.reduce((width, currentLine) => Math.max(width, currentLine.getWidth()), 0)
        );
        const height = Math.ceil(
            this.lines.reduce((height, currentLine) => (height += currentLine.getHeight()), 0)
        );
        const lineHeight = Math.floor(height / lines.length);

        const descentHeight = this.lines.length
            ? this.lines[this.lines.length - 1].getDescentHeight()
            : 0;

        this.finalize();

        return {
            lines,
            width,
            height: height + descentHeight,
            lineHeight
        };
    }
}
