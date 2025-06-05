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

api.runtime.onStartup.addListener(() => {
    (async () => {
        const data = await new Promise((resolve) => {
            api.storage.sync.get(['prefs_icon'], resolve);
        });
        let iconpath = "resources/icon.png";
        if (data.prefs_icon && ["a2", "a3", "a4", "a5", "a6"].includes(data.prefs_icon)) {
            iconpath = api.runtime.getURL("resources/" + data.prefs_icon + ".png");
        }
        try {
            await api.action.setIcon({ path: iconpath });
        } catch (err) {
            console.error("could not set icon: ", err);
        }
    })();
});


api.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
