var api = typeof browser !== 'undefined' ? browser : chrome;

async function safe_uwuify() {
    const value = await getState('prefs_uwuify');
    if (value) {
        await callSafe_bg(true);
    }
}

api.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "call_uwuify") {
        await callSafe_bg();
    }
});

async function call_uwuify() {
    await uwuifyText(document.body);
}

function enableUwuify() {
    api.storage.sync.set({ prefs_uwuify: true }, function () {
        populate_prefs();
    });
}

function disableUwuify() {
    api.storage.sync.set({ prefs_uwuify: false }, function () {
        populate_prefs();
    });
}

function getState(key) {
    return new Promise((resolve, reject) => {
        api.storage.sync.get(key, function (data) {
            resolve(data[key]);
        });
    });
}

async function checkWhitelist() {
    const url = window.location.href;
    const userWhitelist = await getWhitelist_content();
    for (const user_entry of userWhitelist) {
        if (url.includes(user_entry)) {
            return user_entry;
        }
    }
    return false;
}

function hideLayoutForever() {
    api.storage.sync.set({ hideLayoutModal: true });
}

async function checkStateLayoutModal() {
    const value = await getState('hideLayoutModal');
    return value;
}

async function checkUwuAmount() {
    const value = await getState('prefs_moreuwu');
    return value;
}

async function uwuifyText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        if (!/\S/.test(node.textContent)) {
            return;
        }
        let parent = node.parentNode;
        while (parent) {
            // this was uwuifying scripts and styles and that was breaking a *lot* of sites lol
            if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
                return;
            }
            parent = parent.parentNode;
        }
        node.textContent = await uwuify(node.textContent);
    } else {
        for (let i = 0; i < node.childNodes.length; i++) {
            uwuifyText(node.childNodes[i]);
        }
    }
}

async function uwuify(str) {
    str = str.replace(/r|l/g, 'w')
        .replace(/R|L/g, 'W')
        .replace(/Chr|chr/g, 'cw')
        .replace(/Ove|ove/g, 'uv')
        .replace(/ss|SS/g, 'sh')
        .replace(/n([aeiou])/g, 'ny$1')
        .replace(/N([aeiou])/g, 'Ny$1')
        .replace(/N([AEIOU])/g, 'Ny$1');

    if ((await checkUwuAmount() == true)) {
        let sentences = str.split(/(?<=[.,!?])\s+/);
        for (let i = 0; i < sentences.length; i++) {
            let words = sentences[i].split(' ');
            if (words.length >= 1) {
                if (Math.random() < 0.1) {
                    let additions = [' nya', ' hehe', ' uwu', ' owo'];
                    let addition = additions[Math.floor(Math.random() * additions.length)];
                    let lastWord = words[words.length - 1];
                    let punctuation = '';
                    if (lastWord.endsWith('.') || lastWord.endsWith('!') || lastWord.endsWith('?')) {
                        punctuation = lastWord.slice(-1);
                        lastWord = lastWord.slice(0, -1);
                    }
                    lastWord += addition + punctuation;
                    words[words.length - 1] = lastWord;
                    sentences[i] = words.join(' ');
                }
            }
        }
        str = sentences.join(' ');
    }
    return str;
}

(async function () {
    console.log('Started content script');
    await safe_uwuify();
})();



const modalCSS = `
#warn-layout-modal {
    position: fixed;
    z-index: 1000;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    width: 100%;
    height: fit-content;
    max-height: 50%;
    display: none;
    text-align: center;
    
}
#warn-layout-modal .modal-content {
    background: rgba(55, 164, 164, .9);
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    padding: 20px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    width: 100%;
    color: #fff;
    font-size: 1.2em;
    padding-bottom: 15%;
}
button#confirm-button, button#cancel-button {
    background: #1f7a77;
    color: white;
    border: none;
    padding: 15px 20px;
    margin-right: 2%;
}
button#confirm-button:active, button#cancel-button:active {
    background: #19615e;
}
button#hide-layout-forever-button {
    background: #852C2C;
    color: white;
    border: none;
    padding: 15px 20px;
}
`;

const style = document.createElement('style');
style.textContent = modalCSS;
document.head.append(style);

const modalContainer = document.createElement('div');

const modal = document.createElement('div');
modal.id = 'warn-layout-modal';

const modalContent = document.createElement('div');
modalContent.className = 'modal-content';

const modalIcon = document.createElement('img');
modalIcon.src = api.runtime.getURL('resources/icon_info.png');
modalIcon.id = 'modal-icon';
modalIcon.alt = 'uwuify icon';

const modalMessage = document.createElement('p');
modalMessage.id = 'modal-message';

const confirmButton = document.createElement('button');
confirmButton.id = 'confirm-button';
confirmButton.textContent = 'Yes, uwuify';

const cancelButton = document.createElement('button');
cancelButton.id = 'cancel-button';
cancelButton.textContent = 'Cancel';

const hideLayoutButton = document.createElement('button');
hideLayoutButton.id = 'hide-layout-forever-button';
hideLayoutButton.textContent = 'don\'t ask again';

modalContent.append(modalIcon, modalMessage, confirmButton, cancelButton, hideLayoutButton);
modal.append(modalContent);
modalContainer.append(modal);

document.body.append(modalContainer);

function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = 'flex';
}

function hideModal() {
    modal.style.display = 'none';
}

confirmButton.addEventListener('click', async function () {
    hideModal();
    await call_uwuify();
});

hideLayoutButton.addEventListener('click', async function () {
    hideLayoutForever();
    hideModal();
    await call_uwuify();
});

cancelButton.addEventListener('click', hideModal);

function getWhitelist_content() {
    return new Promise((resolve, reject) => {
        api.storage.sync.get('whitelist', function (data) {
            resolve(data['whitelist'] || []);
        });
    });
}

async function callSafe_bg(autostate) {
    if ((await checkWhitelist() != false)) {
        if (autostate != true) {
            const notif = 'The term \"' + await checkWhitelist() + '\" appears on uwuify\'s whitelist. ' +
                'Do you wish to uwuify anyway?';
            if (await checkStateLayoutModal() == true) {
                await call_uwuify();
            } else {
                showModal(notif);
            }
        }
    } else {
        await call_uwuify();
    }
}