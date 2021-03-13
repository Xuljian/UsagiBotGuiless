var mainProcess = require('./Usagi/websocket-actions').mainProcess;
const { realTimeRepository, onclose } = require('./Usagi/temp-repository');
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

[`SIGQUIT`,`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    let defaultFunction = () => {
        console.log(eventType)
        onclose(true);
    };
    if (eventType === 'uncaughtException') {
        defaultFunction = UncaughtExceptionHandler;
    }
    process.on(eventType, defaultFunction);
})

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