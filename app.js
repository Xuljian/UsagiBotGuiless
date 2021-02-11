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

//#region electron


// ipcMain.on('dm', (event, data) => {
//     restActions.sendMessage(data);
// })

// ipcMain.on('dmId', (event, data) => {
//     restActions.sendDMByIds(data);
// })

// ipcMain.on('ignore', (event, data) => {
//     realTimeRepository.channelIgnore.push(data.channelId);
// })

// ipcMain.on('unignore', (event, data) => {
//     realTimeRepository.channelIgnore = realTimeRepository.channelIgnore.filter((o) => {
//         return o != data.channelId;
//     })
// })

// ipcMain.on('registerEmojiChannel', (event, data) => {
//     realTimeRepository.emojiChannel.push(data.channelId);
// })

// ipcMain.on('unregisterEmojiChannel', (event, data) => {
//     realTimeRepository.emojiChannel = realTimeRepository.emojiChannel.filter((o) => {
//         return o != data.channelId;
//     })
// })

// ipcMain.on('registerGuildArchive', (event, data) => {
//     realTimeRepository.archiveChannel[data.guildId] = data.channelId;
// })

// ipcMain.on('unregisterGuildArchive', (event, data) => {
//     delete realTimeRepository.archiveChannel[data.guildId];
// })

// ipcMain.on('registerArchiveListener', (event, data) => {
//     let archiveListenerChannel = realTimeRepository.archiveListenChannel[data.guildId];
//     if (archiveListenerChannel == null) {
//         realTimeRepository.archiveListenChannel[data.guildId] = [data.channelId];
//     } else {
//         if (archiveListenerChannel.indexOf(data.channelId) < 0) {
//             archiveListenerChannel.push(data.channelId);
//         }
//     }
// })

// ipcMain.on('unregisterArchiveListener', (event, data) => {
//     let archiveListenerChannel = realTimeRepository.archiveListenChannel[data.guildId];
//     if (archiveListenerChannel == null) {
//         return;
//     } else {
//         let foundIndex = archiveListenerChannel.indexOf(data.channelId);
//         if (foundIndex > -1) {
//             archiveListenerChannel.splice(foundIndex, 1);
//         }
//     }
// })

//#endregion electron