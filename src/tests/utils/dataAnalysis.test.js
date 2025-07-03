import '@testing-library/jest-dom';

import { calculateAccuracy, euclid_dist, distls, isSameLength, fi2fiArr, split, distAverge, mean, removeNull, getPPI, pix2mm, removeIfNotShrinking, rms, sd, calculatePrecision} from '../../util/dataAnalysis';

const fs = require('node:fs');

describe('accuracy', () => {
    const dataFilePath = 'src\\tests\\utils\\testData\\trackerData.json';
    // Read the JSON file
    const content = JSON.parse(
        fs.readFileSync(dataFilePath, 'utf8')
    );
  

    test('tests split that it slices up the points into an array for each active fixation point', () => {
        const fi = content.tracking_points.fixation_index
        const xs = split(content.tracking_points.x, fi)
        expect(xs.length - 1).toBe(fi[fi.length - 1]);
    });
    
    test('tests euclid_dist that it calculates the distance between two points', () => {
        const xy0 = [1, 2]
        const xy1 = [4, 8]
        const dist = euclid_dist(xy0, xy1)
        expect(dist).toBe(6.708203932499369);
    })
    test('fi2fiArr that it creates an array of fixation indices', () => {
        const fi = content.tracking_points.fixation_index
        const fiArr = fi2fiArr(fi)
        expect(fiArr.length).toBe(fi[fi.length - 1]);
    })
    test("dist for a simple case", () => {
        const xs = [1, 5, 3, 4, 5, 6]
        const ys = [4, 5, 6., 7, 8, 9, 10]
        const fx = [7, 8, 9, 10, 11, 12]
        const fy =  [10, 11, 12, 13, 14, 15]
        const fi = [0, 0, 1, 1, 2, 2]
        const distances = distls(split(xs, fi), split(ys, fi), split(fx, fi), split(fy, fi));
        expect(distances.length).toBe(3); // 3 groups of distances

    
    })
    test('tests dist that it calculates the distance from each point to the fixation point', () => {

        const xs = content.tracking_points.x    
        const ys = content.tracking_points.y
        const fi = content.tracking_points.fixation_index
        const fx = content.tracking_points.fixation_x
        const fy = content.tracking_points.fixation_y
        const xsSplit = split(xs, fi);
        const ysSplit = split(ys, fi);
        const fxSplit = split(fx, fi);
        const fySplit = split(fy, fi);


        expect(isSameLength([xs,ys,fi])).toBe(true); 
        expect(isSameLength([fx,fy])).toBe(true);
        const distances = distls(xsSplit, ysSplit, fxSplit, fySplit);

    })
    test("mean that it calculates the mean of an array", () => {
        const arr = [1, 2, 3, 4, 5]
        const meanValue = mean(arr)
        expect(meanValue).toBe(3);
    
    })
    test("distAverge that it calculates the average of an array of arrays", () => {
        const arr = [[1.0, 2., 3.], [4., 5., 6.], [7., 8., 9.]]
        const averages = distAverge(arr)
        expect(averages).toEqual([2., 5., 8.]);
    })
    test("simple test for distance", () => {
        const arr = [1,2,3,4,5,6,7,8,9,10]
        const fi = [0,0,0,0,1,1,1,2,2,2]
        const xs = split(arr, fi)
        const distances = distls(xs, xs, xs, xs)
        const averages = distAverge(distances)
        expect(averages).toEqual([0, 0, 0]);
    })
    test('Calculate the averages of the distances', () => {
        const xs = content.tracking_points.x    
        const ys = content.tracking_points.y
        const fi = content.tracking_points.fixation_index
        const fx = content.tracking_points.fixation_x
        const fy = content.tracking_points.fixation_y
        const xsSplit = split(xs, fi);
        const ysSplit = split(ys, fi);
        const fxSplit = split(fx, fi);
        const fySplit = split(fy, fi);

        expect(isSameLength([xs,ys,fi])).toBe(true);
        expect(isSameLength([fx,fy])).toBe(true);
        const distances = distls(xsSplit, ysSplit, fxSplit, fySplit);


        const averages = distAverge(distances);

        expect(averages.every((avg) => typeof avg === 'number')).toBe(true); 
    
    })
    test('calcutate pixel density', () => { 
        const xs = content.tracking_points.x    
        const ys = content.tracking_points.y
        const fi = content.tracking_points.fixation_index
        const fx = content.tracking_points.fixation_x
        const fy = content.tracking_points.fixation_y
        const xsSplit = split(xs, fi);
        const ysSplit = split(ys, fi);
        const fxSplit = split(fx, fi);
        const fySplit = split(fy, fi);

        expect(isSameLength([xs,ys,fi])).toBe(true);
        expect(isSameLength([fx,fy])).toBe(true);
        const distances = distls(xsSplit, ysSplit, fxSplit, fySplit);
        const averages = distAverge(distances);
        const ppi = getPPI()
        const mm = pix2mm(mean(averages))
        expect(mm).toBeCloseTo(29.1776077744928, 1);
    })  
    test('removeIfNotShrinking', () => {
        const arr = [1, 2, 3, 4, 5]
        const is_shrinking = [true, false, true, false, true]
        const result = removeIfNotShrinking(arr, is_shrinking)
        expect(result).toEqual([1, 3, 5]);

        const arr2 = [1, 2, 3, 4, 5, NaN, null, 2, undefined]
        const is_shrinking2 = [true, false, true, false, true, false, false, false, false]
        const result2 = removeIfNotShrinking(arr2, is_shrinking2)
        expect(result2).toEqual([1, 3, 5]);
    })
    test('calcualate accuracy', () => {
        const xs = content.tracking_points.x    
        const ys = content.tracking_points.y
        const fi = content.tracking_points.fixation_index
        const fx = content.tracking_points.fixation_x
        const fy = content.tracking_points.fixation_y
        const isShrinking = content.tracking_points.is_shrinking

        const data = calculateAccuracy(xs,ys,fx,fy,fi, isShrinking)
        
        expect(data.accuracy).toBeCloseTo(21.31656761903601, 1);
    })
    test('rms', () => {
        const arr = [1, 2, 3, 4, 5]
        const result = rms(arr)
        
        expect(result).toBeCloseTo(1, 1);
    })
    test('sd', () => {
        const arr = [1, 2, 3, 4, 5]
        const result = sd(arr)
        expect(result).toBeCloseTo(1.4142135623731, 1);
    })
    test('calculatePrecision', () => {


        const xs = content.tracking_points.x    
        const ys = content.tracking_points.y
        const fi = content.tracking_points.fixation_index
        const isShrinking = content.tracking_points.is_shrinking

        const precision0 = calculatePrecision(xs, ys, fi, isShrinking) 
       

        const precision1 = calculatePrecision(xs, ys, fi, null)
        
        


    })
});
