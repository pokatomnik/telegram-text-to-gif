import {WriteStream} from 'fs';
import GIFEncoder from 'gifencoder';

import {Configurable} from '../common/configurable';
import {GifMakerConfiguration} from './configuration';
import {getSizesAndLines, getContext} from './measure';
import {CanvasType} from './canvas-type';

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

        const measurements = getSizesAndLines({
            font,
            fillStyle,
            text,
            maxWidth: this.config.getConfig().maxWidth
        });

        const {width, height} = measurements;

        const paddings = CanvasType.makePaddings(0, 0);

        const ctx = getContext(fillStyle, font).withSizes(
            width + paddings.horizontal * 2,
            height + paddings.vertical * 2
        );

        const encoder = this.getEncoder(
            width + paddings.horizontal * 2,
            height + paddings.vertical * 2,
            writeStream
        );

        new CanvasType(measurements, paddings).writeTo(ctx, (frame) => {
            encoder.addFrame(frame);
        });

        encoder.finish();

        return this;
    }
}
