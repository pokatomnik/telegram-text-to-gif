import {CanvasRenderingContext2D} from 'canvas';
import {NotFinalized, Finalizable} from '../../common/finalizable';

import {Measurements} from '../virtual-canvas';

interface Paddings {
    horizontal?: number;
    vertical?: number;
}

const greaterThan = (minValue: number, value: number) =>
    Math.max(Math.min(value, minValue), Math.max(value, minValue));

export class CanvasType extends Finalizable {
    /**
     * Minumum vertical padding
     */
    public static MIN_VERTICAL_PADDING = 0;

    /**
     * Minimum horizontal padding
     */
    public static MIN_HORIZONTAL_PADDING = 0;

    public static makePaddings(horizontal: number = 0, vertical: number = 0): Required<Paddings> {
        return {
            horizontal: greaterThan(CanvasType.MIN_HORIZONTAL_PADDING, horizontal),
            vertical: greaterThan(CanvasType.MIN_VERTICAL_PADDING, vertical)
        };
    }

    private paddings: Required<Paddings>;
    private measurements: Measurements;

    constructor(
        measurements: Measurements,
        {horizontal = 0, vertical = 0}: Required<Paddings> = {horizontal: 0, vertical: 0}
    ) {
        super();
        this.measurements = measurements;
        this.paddings = CanvasType.makePaddings(horizontal, vertical);
    }

    @NotFinalized
    public writeTo(
        ctx: CanvasRenderingContext2D,
        frameConsumer: (ctx: CanvasRenderingContext2D) => void
    ) {
        let x = this.paddings.horizontal;
        let y = this.paddings.vertical + this.measurements.lineHeight;
        this.measurements.lines.forEach((line) => {
            line.forEach((letter) => {
                const width = ctx.measureText(letter).width;
                ctx.fillText(letter, x, y);
                x += width;
                frameConsumer(ctx);
            });

            // insert a new line
            y += this.measurements.lineHeight;
            x = this.paddings.horizontal;
        });

        this.finalize();
        return this;
    }
}
