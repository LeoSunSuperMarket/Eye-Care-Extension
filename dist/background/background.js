"use strict";
let reminderId = null;
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'setReminder') {
        if (reminderId) {
            clearInterval(reminderId);
        }
        reminderId = setInterval(() => {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: '../icons/icon48.png',
                title: '护眼提醒',
                message: '请休息一下眼睛！'
            });
        }, message.value * 60 * 1000);
    }
});
