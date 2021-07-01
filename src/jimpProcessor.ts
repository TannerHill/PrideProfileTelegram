import Jimp from 'jimp';
import * as mime from 'mime';
import { hasFlag } from './util';

interface Point {
    x: number,
    y: number
}

export enum ShapeTypes {
    Square = 1 << 0,
    Circle = 1 << 1,
    Ring = Circle | 1 << 2
}

interface DrawOptions {
    colorRange: number[] | number[][],
    shape?: ShapeTypes,
    thickness?: number,
    radius?: number,
    zoom?: number,
    opacity?: number
}

interface ColorParameters {
    colorRange: number[] | number[][],
    point: Point,
    height: number,
    width: number,
    distanceFromCenter : number,
    innerDitherStart: number,
    outerDitherStart: number,
    radius: number,
    innerRadius: number,
    shape: ShapeTypes
}

export const defaultOptions : DrawOptions = {
    colorRange: [0x00000000],
    shape: ShapeTypes.Ring,
    zoom: 10,
    thickness: 0.2,
    opacity: 0.7
};

const getColor = (colorParameters : ColorParameters) => {
    const { 
        shape, 
        colorRange, 
        point, 
        height, 
        width, 
        distanceFromCenter, 
        innerDitherStart, 
        outerDitherStart, 
        radius, 
        innerRadius 
    } = colorParameters;
    let baseColor = 0xFFFFFF00;
    let colorOptions : number[] = [0xFFFFFF00];
    if(!colorRange.some(Array.isArray)) {
        colorOptions = colorRange as number[];
    }
    else {
        const colorSplitIndex = Math.floor(point.x / (width / colorRange.length));
        colorOptions = colorRange[colorSplitIndex] as number[];
    }
    const colorIndex = Math.floor(point.y / (height / colorOptions.length));
    baseColor = colorOptions[colorIndex];
    return isInRange(distanceFromCenter, outerDitherStart, radius) && !hasFlag(shape, ShapeTypes.Square)
        ? (baseColor + 0xFF) - interpolateOpacity(distanceFromCenter, outerDitherStart, radius)
        : isInRange(distanceFromCenter, innerRadius, innerDitherStart) && hasFlag(shape, ShapeTypes.Ring)
            ? baseColor + interpolateOpacity(distanceFromCenter, innerRadius, innerDitherStart)
            : (baseColor + 0xFF);
}

export const applyPride = async (imageUrl: string, options : DrawOptions) : Promise<Buffer | null> => {
    let { radius, thickness, colorRange, zoom, shape=defaultOptions.shape, opacity=defaultOptions.opacity } = {
        ...defaultOptions,
        ...options
    };
    const image = await Jimp.read(imageUrl);
    radius = radius ? radius : (image.getWidth() / 2);
    const width = radius * 2;
    const height = width;
    const center : Point = { x: radius - 1, y: radius - 1 };
    radius += zoom;
    const innerRadius = hasFlag(shape, ShapeTypes.Ring)
        ? radius * (1 - thickness)
        : 0;
    const thicknessPx = radius * thickness;
    const outerDitherStart = Math.floor(radius - (thicknessPx * 0.1));
    const innerDitherStart = Math.floor(innerRadius + (thicknessPx * 0.1));
    return new Promise((resolve, reject) => {
        new Jimp(width, height, (ringErr, ring) => {
            if(!ringErr) {
                for(let i = 0; i < width; i++) {
                    for(let j = 0; j < height; j++) {
                        const point = { x: i, y: j };
                        const distance = getDistance(center,point);
                        const color = getColor({
                            colorRange,
                            distanceFromCenter: distance,
                            height,
                            width,
                            innerDitherStart,
                            outerDitherStart,
                            innerRadius,
                            point,
                            radius,
                            shape
                        });
                        if(isInRange(distance, innerRadius, radius) || shape === ShapeTypes.Square) {
                            ring.setPixelColor(color, point.x, point.y);
                        }
                    }
                }
                image.composite(ring, 0, 0, { mode: Jimp.BLEND_SOURCE_OVER, opacitySource: opacity, opacityDest: 1 }, async (compositeErr, composite) => {
                    if(!compositeErr)
                        resolve(composite.getBufferAsync(mime.getType('png')));
                    else
                        reject(compositeErr);
                })
            }
            else {
                reject(ringErr);
            }
        });
    });
}

const isInRange = (value : number, min : number, max : number) => {
    return value >= min && value <= max;
} 
  
const getDistance = (first : Point, second : Point) => {
    let distance = Math.sqrt(Math.pow(second.x-first.x, 2)+Math.pow(second.y-first.y, 2));
    return distance;
}
  
const interpolateOpacity = (value : number, min : number, max : number) => {
    const proportion = (value - min) / (max - min);
    return Math.floor(proportion * 255);
}