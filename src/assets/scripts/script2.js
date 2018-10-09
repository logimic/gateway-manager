oegw.script.make = function (param) {

    param.green.output = false;
    param.blue.output = false;
    param.red.output = false;

    var len = param.FaceRecognition.faces.length;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            if (param.FaceRecognition.faces[i].age < 23) {
                param.green.output = true;
                break;
            }
        }
    }

    return param;
};
