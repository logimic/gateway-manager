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
