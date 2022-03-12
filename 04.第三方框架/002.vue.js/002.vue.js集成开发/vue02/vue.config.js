
console.log("_________1________");

"use strict"

let webpaakConfig;

let env = process.env.ENV;

console.log("_________process________" + process);
console.log("_________process.env________" + process.env);
console.log("_________process.env.ENV________" + env);



webpaakConfig = require(`./webpackConfig/${env}.js`);

module.exports = webpaakConfig;



 