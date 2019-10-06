import {WriteStream} from 'fs';
import GIFEncoder from 'gifencoder';

import {Configurable} from '../common/configurable';
import {GifMakerConfiguration} from './configuration';
import {getSizesAndLines, getContext} from './measure';

const DEFAULT_PARAMS: GifMakerConfiguration = {
    delay: 500,
    fillStyle: '#ffffff',
    font: '20px Arial',
    maxWidth: 320,
    quality: 100,
    repeat: true
};

export class GIFMaker {
    private config: Configurable<GifMakerConfiguration>;

    constructor({
        repeat = DEFAULT_PARAMS.repeat,
        delay = DEFAULT_PARAMS.delay,
        quality = DEFAULT_PARAMS.quality,
        fillStyle = DEFAULT_PARAMS.fillStyle,
        font = DEFAULT_PARAMS.font,
        maxWidth = DEFAULT_PARAMS.maxWidth
    }: Partial<GifMakerConfiguration> = DEFAULT_PARAMS) {
        this.config = new Configurable<GifMakerConfiguration>({
            repeat,
            delay,
            fillStyle,
            font,
            maxWidth,
            quality
        });
    }

    public setup<T extends keyof GifMakerConfiguration>(key: T, value: GifMakerConfiguration[T]) {
        this.config.update(key, value);

        return this;
    }

    private getEncoder(width: number, height: number, writeStream: WriteStream) {
        const {quality, delay, repeat} = this.config.getConfig();
        const encoder = new GIFEncoder(width, height);
        encoder.createReadStream().pipe(writeStream);
        encoder.start();
        encoder.setRepeat(repeat ? 0 : 1);
        encoder.setDelay(delay);
        encoder.setQuality(quality);

        return encoder;
    }

    public writeTo(text: string, writeStream: WriteStream) {
        const {font, fillStyle} = this.config.getConfig();

        const {height, lines, width, lineHeight, padding} = getSizesAndLines({
            font,
            fillStyle,
            text,
            maxWidth: this.config.getConfig().maxWidth
        });

        const ctx = getContext(fillStyle, font).withSizes(width, height);

        const encoder = this.getEncoder(width, height, writeStream);

        let x = padding;
        let y = padding;
        lines.forEach((line) => {
            [...line.join(' ')].forEach((letter) => {
                const width = ctx.measureText(letter).width;
                ctx.fillText(letter, x, y);
                x += width;
                encoder.addFrame(ctx);
            });

            // insert a new line
            y += lineHeight;
            x = padding;
        });

        encoder.finish();

        return this;
    }
}
