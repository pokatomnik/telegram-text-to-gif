declare module 'gifencoder' {
    import {Readable} from 'stream';
    import {CanvasRenderingContext2D} from 'canvas';

    export default class GIFEncoder {
        constructor(width: number, height: number);
        public createReadStream(): Readable;
        public start(): void;
        public setRepeat(value: number): void;
        public setDelay(value: number): void;
        public setQuality(value: number): void;
        public addFrame(context: CanvasRenderingContext2D): void;
        public finish(): void;
    }
}
