(function () {
    console.log('started background service');
})();

var api = typeof browser !== 'undefined' ? browser : chrome;

api.runtime.onMessage.addListener((message, sender) => {
    return new Promise((resolve, reject) => {
    });
});

api.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
        await api.tabs.create({ url: "init.html" });
    }
});

api.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('setting listener');
    if (request.action === "call_uwuify") {
        api.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            api.tabs.sendMessage(tabs[0].id, { action: "call_uwuify" });
        });
    }
});

api.commands.onCommand.addListener((command) => {
    if (command === "call_uwuify_kb") {
        api.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            api.tabs.sendMessage(tabs[0].id, { action: "call_uwuify" });
        });
    }
});
