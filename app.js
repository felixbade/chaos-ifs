const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Resize + DPI
const resize = () => {
    const dpi = window.devicePixelRatio;

    canvas.width = window.innerWidth * dpi;
    canvas.height = window.innerHeight * dpi;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(dpi, dpi);
    const smallerSide = Math.min(canvas.width, canvas.height);
    ctx.scale(smallerSide, smallerSide);
}

window.addEventListener('resize', resize);
resize();


// https://x.com/S_Conradi/status/1732819996881891795
// Fractal generated using the chaos game of the iterated function system defined by the Möbius transformations below
// z = (1.18iz + 0.5i) / (-2.22iz + 1.79i) * exp(2 * pi * i * n / 6)
//   = (-1.18z + 0.5) / (-2.21z + 1.79) * exp(2pi * i * n / 6)

// Define the constants
const pi = Math.PI;
const a = -1.18;
const b = 0.5;
const c = -2.21;
const d = 1.79;

// Helper function to multiply two complex numbers
const multiplyComplex = ([ar, ai], [br, bi]) => {
    return [(ar * br - ai * bi), (ar * bi + ai * br)];
}

// Helper function to divide two complex numbers
const divideComplex = ([ar, ai], [br, bi]) => {
    const denom = br * br + bi * bi;
    return [((ar * br + ai * bi) / denom), ((ai * br - ar * bi) / denom)];
}

// Helper function to calculate exp(i * theta)
const expi = (theta) => {
    return [Math.cos(theta), Math.sin(theta)];
}

// Define your complex function
const complexFunction = ([zReal, zImag], n) => {
    // Calculate the numerator and the denominator as complex numbers
    const numerator = [a * zReal + b, a * zImag];
    const denominator = [c * zReal + d, c * zImag];

    // Divide the numerator by the denominator
    const rationalPart = divideComplex(numerator, denominator);

    // Calculate exp(2πi * n / 6)
    const exponent = 2 * pi * n / 6;
    const exponentialPart = expi(exponent);

    // Multiply the two parts together
    return multiplyComplex(rationalPart, exponentialPart);
}

const f = (x) => complexFunction(x, Math.floor(Math.random() * 6));

// Random starting point
let z = [
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
];


// Canvas stuff

const scale = 1.5;
const dotSize = 0.0005;
const background = 'hsl(40, 20%, 90%)';
const foreground = 'hsl(220, 100%, 10%)';

// save transform, reset transform, draw background, restore
ctx.save();
ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.fillStyle = background;
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.restore();
ctx.scale(1 / scale, 1 / scale);

let iteration = 0;

const redraw = () => {
    const addPoint = ([r, i]) => {
        ctx.fillStyle = foreground;
        ctx.globalAlpha = 0.1;
        ctx.fillRect(r, i, dotSize, dotSize);
    }

    // Iterate for 10ms
    // About 30k steps is feasible on a Apple M1
    const steps = 100;
    const start = performance.now();
    while (performance.now() - start < 10) {
        for (let i = 0; i < steps; i++) {
            z = f(z);
            addPoint(z);
        }
        iteration += steps;
    }

    if (iteration < 2e7) {
        requestAnimationFrame(redraw);
    }
}

redraw();