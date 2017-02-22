'use strict'

let fs = require('fs');

let sourceDir = '/home/users/chenkang02/git/mobojs-jssdk/src/plugin/';

let styleList = [];
let offerList = [];

let stylePattern = /^style\.(\w+)\.js$/
let offerPattern = /^offer\.(\w+)\.js$/

if (fs.existsSync(sourceDir)) {
    let files = fs.readdirSync(sourceDir);
    files.map(item => {
        let myArr = stylePattern.exec(item);
        if (myArr) {
            console.log(myArr[1]);
        }
    });
    files.map(item => {
        let myArr = offerPattern.exec(item);
        if (myArr) {
            console.log(myArr[1]);
        }
    });

}
