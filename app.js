var { mainProcess, end } = require('./Usagi/websocket-actions');
const { realTimeRepository, onClose } = require('./Usagi/temp-repository');
const cronJob = require('./Usagi/utils/cron-job');
const { endPSO2 } = require('./Usagi/utils/pso2/pso2-modules');
const { endRest } = require('./Usagi/rest-actions');

const { timeoutChainer } = require('./Usagi/utils/timeout-chainer');
const { log } = require('./Usagi/utils/logger');

var messageLog = null;

var start = function () {
    try {
        messageLog = mainProcess();
    } catch (exception) {
        log(exception);
        end();
        start();
    }
}

function UncaughtExceptionHandler(err) {
    log("Uncaught Exception Encountered!!");
    log("err: ", err);
    log("Stack trace: ", err.stack);
    setInterval(function () { }, 5000000);
}

[`SIGQUIT`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    let defaultFunction = () => {
        onClose(true, true, () => {
            end();
            cronJob.haltCron();
            endPSO2();
            endRest();
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
        log(e)
        timeout.stop = true;
    }
}, 500)