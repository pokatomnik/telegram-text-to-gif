import {CanvasRenderingContext2D} from 'canvas';

export class Word {
    private readonly word: string;
    private readonly width: number;
    private readonly height: number;
    private readonly descentHeight: number;
    private readonly context: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D, word: string) {
        this.context = ctx;
        this.word = word;
        const textMetrics = this.context.measureText(this.word);
        this.width = textMetrics.width;
        this.height = textMetrics.emHeightAscent;
        this.descentHeight = textMetrics.emHeightDescent;
    }

    public getWord() {
        return this.word;
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public getDescentHeight() {
        return this.descentHeight;
    }

    public getContext() {
        return this.context;
    }
}
