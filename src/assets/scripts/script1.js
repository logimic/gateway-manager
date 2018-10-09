oegw.script.make = function (param) {

    param.green.output = false;
    param.blue.output = false;
    param.red.output = false;

    if (param.FaceRecognition.faces.length > 0) {
        param.green.output = true;
    }

    return param;
};
