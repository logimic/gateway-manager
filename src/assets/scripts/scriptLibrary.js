"use strict";

// JavaScript 'namespace' helper routine
var globalObject = this;

/* Function: namespace
Declares a new namespace.

Parameters:
  name - string: Namespace name. Use dots for multilevel namespace.
*/
var namespace = function (name) {
    var tokens = name.split('.');
    var object = globalObject;
    while (tokens.length > 0) {
        var token = tokens.shift();
        object = object[token] = object[token] || {};
    }
    return object;
};

/////////////////////////////////////
namespace( 'oegw.script' );

oegw.script.make = function (param) {

    param.green.output = false;
    param.blue.output = false;
    param.red.output = false;

    if (param.FaceRecognition.faces.length === 0) {
        param.green.output = false;
        param.blue.output = false;
        param.red.output = false;
    }
    else if (param.FaceRecognition.faces.length === 1) {
        if (param.FaceRecognition.faces[0].maleProb < 0.4) {
            param.red.output = true;
        }
        else if (param.FaceRecognition.faces[0].maleProb > 0.6) {
            param.blue.output = true;
        }
        else {
            param.red.output = true;
            param.blue.output = true;
        }
    }
    else {
        param.green.output = true;
    }

    return param;
};
