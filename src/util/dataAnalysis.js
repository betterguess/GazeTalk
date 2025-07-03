import {getDeviceType} from './deviceUtils.js'

const inch2mm = 25.4; // 1 inch = 25.4 mm
export const find_rms = (points_x, points_y) => {
    let sx = 0.0
    let sy = 0.0
    for (let i = 0; i < points_x.length - 1; i++) {
        sx = sx + (points_x[i] - points_x[i + 1] ** 2)
        sy = sy + (points_y - points_y[i + 1] ** 2)
    }
    sx = Math.sqrt(sx)
    sy = Math.sqrt(sy)
    return {sx, sy}
}
// For finding euclidean distance between a set of 2 points.
export const euclid_dist = ([x0, y0], [x1, y1]) =>
    Math.sqrt((x0 - x1)**2 + (y0 - y1)**2);

// slice up the points into an array for each active fixation point
export const split = (arr, fi) => fi.reduce((acc, index, i) => {
    acc[index] = acc[index] || [];
    acc[index].push(arr[i]);
    return acc;
}, []); 
// distance from each point to the fixation point
export const dist = (xs, ys, fx, fy) => {
    return xs.reduce((acc, x, i) => {
        acc.push(
            euclid_dist(
                [x, ys[i]],
                [fx[i], fy[i]]
            )
        )
        return acc;
    }, []);
}

export const distls = (xsArr, ysArr, fxArr, fyArr) => {
    return xsArr.map((xs, i) => 
        dist(xsArr[i], ysArr[i], fxArr[i], fyArr[i])
    );
}

export const mean = (arr) => {
    if (arr.length === 0) return 0;
    
    const numericValues = arr.filter(val => typeof val === 'number' && !isNaN(Number(val)))
                             .map(val => typeof val === 'number' ? val : Number(val));
    
    if (numericValues.length === 0) return 0;
    
    return numericValues.reduce((acc, current) => acc + current, 0) / numericValues.length;
  };

export const removeNull = (arr) => {
    return arr.filter((elm) => elm !== null && elm !== undefined);
}

export const distAverge = (arr) => {
    return arr.map((subArr) =>  mean(removeNull(subArr)));

}
export const sd = (arr) => {
    const meanVal = mean(arr)
    const variance = arr.reduce((acc, val) => acc + (val - meanVal) ** 2, 0) / (arr.length);
    return Math.sqrt(variance);
}

export const rms = (xs) => {
    let sx = 0.0
    for (let i = 0; i < xs.length - 1; i++) {
        sx = sx + (xs[i] - xs[i + 1]) ** 2
    }
    return Math.sqrt(sx / (xs.length - 1))
}

export const calculatePrecision = (xs, ys, fi, isShrinking) => {
    const isShrinkingSplit = isShrinking ? split(isShrinking, fi) : null;
    const xsSplit = isShrinking ? 
        split(xs, fi).map((subArr,i) => 
            subArr.filter((_, j) => isShrinkingSplit[i][j])) 
        : split(xs, fi);
    const ysSplit = isShrinking ? split(ys, fi).map((subArr,i) => subArr.filter((_, j) => isShrinkingSplit[i][j])) : split(ys, fi);
    
    const rmsValues = xsSplit.map((_, i) => {
        return [rms(xsSplit[i]), rms(ysSplit[i])]
    })
    const sdValues = xsSplit.map((_, i) => {
        return [sd(xsSplit[i]), sd(ysSplit[i])]
    })

    const rmsSum = rmsValues.reduce((acc, val) => {
        return [acc[0] + val[0], acc[1] + val[1]]
    },[0,0])
    const rmsAvg = [rmsSum[0] / rmsValues.length, rmsSum[1] / rmsValues.length]

    const sdSum = sdValues.reduce((acc, val) => {
        return [acc[0] + val[0], acc[1] + val[1]]
    }
    , [0,0])
    const sdAvg = [sdSum[0] / sdValues.length, sdSum[1] / sdValues.length]

    return {
        ppi : getPPI(),
        rmsAvg : rmsAvg, rmsAvgMm: rmsAvg.map((val) => pix2mm(val)),
        sdAvg : sdAvg, sdAvgMm: sdAvg.map((val) => pix2mm(val)),
        rmsMm: rmsValues.map((arr) => arr.map((val) => pix2mm(val))),
        sdMm: sdValues.map((arr) => arr.map((val) => pix2mm(val))),
        rmsPixel: rmsValues, sdPixel: sdValues,
        sdPixel : sdValues
    }
    

}

export const fi2fiArr = (fi) => {
    return [...Array(fi[fi.length -1]).keys()];
}
export const pix2mm = (n) => {
    return (n/getPPI()) * inch2mm;
}
export const mm2pix = (n) => {
    return n*(getPPI() * inch2mm);
}
export const getPPI = () => {
    const deviceType = getDeviceType();
    if (deviceType === 'iphone') {
       return (460 /2) / 1.51// from apples website
    } else if (deviceType === 'ipad') {
        return 264 /2// from apples website
    } else if (deviceType === 'other') {
        return 113 // asuming 1080p screen and 19.5 diagonal hre is a great website to calculate ppi https://www.sven.de/dpi/
    }
}

export const isSameLength = (arr) => {
    return arr.every((subArr) => subArr.length === arr[0].length);
}
export const removeIfNotShrinking = (arr, isShrinking) => {
    return arr.filter((_, i) => isShrinking[i]);
}
export const calculateAccuracy  = (xs,ys,fx,fy, fi, isShrinking) => {
    
    const isShrinkingSplit = isShrinking ? split(isShrinking, fi) : null;
    const xsSplit = isShrinking ? split(xs, fi).map((subArr,i) => subArr.filter((_, j) => isShrinkingSplit[i][j])) : split(xs, fi);
    const ysSplit = isShrinking ? split(ys, fi).map((subArr,i) => subArr.filter((_, j) => isShrinkingSplit[i][j])) : split(ys, fi);
    const fxSplit = isShrinking ? split(fx, fi).map((subArr,i) => subArr.filter((_, j) => isShrinkingSplit[i][j])) : split(fx, fi);
    const fySplit = isShrinking ? split(fy, fi).map((subArr,i) => subArr.filter((_, j) => isShrinkingSplit[i][j])) : split(fy, fi);
    const distances = distls(xsSplit, ysSplit, fxSplit, fySplit);
    
    const averages = distAverge(distances);
    const mm = pix2mm(mean(averages))
    return {
        ppi: getPPI(),
        accuracy: mm,
        accuracyInPixel: mean(averages),
        averages: averages, // averages for each fixation point
        averagesInMm: averages.map((avg) => pix2mm(avg)), // averages in mm
    }

}
