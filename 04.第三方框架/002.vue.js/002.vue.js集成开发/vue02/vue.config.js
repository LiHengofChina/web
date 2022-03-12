
console.log("_________1________");

"use strict"

let webpaakConfig;

let env = process.env.ENV;
console.log("_________env________" + env);

//webpaakConfig = require(`./webpackConfig/${env}.js`)
webpaakConfig = require(`./webpackConfig/development.js`)

module.exports = webpaakConfig;



 