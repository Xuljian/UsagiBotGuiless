var { mainProcess, end } = require('./Usagi/websocket-actions');
const { realTimeRepository, onClose } = require('./Usagi/temp-repository');
const cronJob = require('./Usagi/utils/cron-job');
const { endPSO2 } = require('./Usagi/utils/pso2/pso2-modules');
const { endRest } = require('./Usagi/rest-actions');

const { timeoutChainer } = require('./Usagi/utils/timeout-chainer');

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
        onClose(true, () => {
            end();
            cronJob.haltCron();
            endPSO2();
            endRest();
            setTimeout(() => {
                process.exit(0);
            }, 5000);
        });
    };
    if (eventType === 'uncaughtException') {
        defaultFunction = UncaughtExceptionHandler;
    }
    process.on(eventType, defaultFunction);
})

let timeout = timeoutChainer(() => {
    try {
        if (realTimeRepository.fileInit) {
            start();
            timeout.stop = true;
        }
    } catch (e) {
        console.log(e)
        timeout.stop = true;
    }
}, 500)