var btnCode;
var whichButton = function (e) {
    // Handle different event models
    var e = e || window.event;;

    if ('object' === typeof e) {
        btnCode = e.button;

        switch (btnCode) {
            case 0:
                console.log('Left button clicked.');
            break;

            case 1:
                console.log('Middle button clicked.');
            break;

            case 2:
                console.log('Right button clicked.');
            break;

            default:
                console.log('Unexpected code: ' + btnCode);
        }
    }
}
var clear = function (e) {
    btnCode = -1;
}