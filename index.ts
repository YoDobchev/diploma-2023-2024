import Jimp from 'jimp';

const options = [
    // {apply: "hue", params: [70] },
    { apply: "red", params: [60] },
    { apply: "brighten", params: [20] },
];

Jimp.read("img/input.jpg", (err: any, lenna: any) => {
    if (err) throw err;
    lenna
        .color(options)
        // .pixelate(2)
        // .resize(256, 256) // resize
        // .quality(60) // set JPEG quality
        // .greyscale() // set greyscale
        .write("img/output.jpg"); // save
});
console.log("lol")