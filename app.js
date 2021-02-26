var mainProcess = require('./websocket-actions').mainProcess;
const { realTimeRepository } = require('./temp-repository');
const { clearInterval } = require('timers');

var messageLog = null;

var start = function () {
    try {
        messageLog = mainProcess();
    } catch (exception) {
        console.log(exception);
        start();
    }
}

function UncaughtExceptionHandler(err) {
    console.log("Uncaught Exception Encountered!!");
    console.log("err: ", err);
    console.log("Stack trace: ", err.stack);
    setInterval(function () { }, 5000000);
}

process.on('uncaughtException', UncaughtExceptionHandler);

let timeOut = setInterval(() => {
    try {
        if (realTimeRepository.fileInit) {
            start();

            clearInterval(timeOut);
        }
    } catch (e) {
        console.log(e)
    }
}, 500)