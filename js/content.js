var api = typeof browser !== 'undefined' ? browser : chrome;

function safe_uwuify() {
    getState('prefs_uwuify').then(value => {
        if (value || value === undefined) {
            callSafe_bg(true);
        } else {
            console.log('uwuify is not enabled');
        }
    });
}

api.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "call_uwuify") {
        await callSafe_bg();
    }
});

function call_uwuify() {
    uwuifyText(document.body);
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

function uwuifyText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        let parent = node.parentNode;
        while (parent) {
            // this was uwuifying scripts and styles and that was breaking a *lot* of sites lol
            if (parent.tagName === 'script' || parent.tagName === 'style') {
                return;
            }
            parent = parent.parentNode;
        }
        node.textContent = uwuify(node.textContent);
    } else {
        for (let i = 0; i < node.childNodes.length; i++) {
            uwuifyText(node.childNodes[i]);
        }
    }
}

function uwuify(str) {
    return str.replace(/r|l/g, 'w')
        .replace(/R|L/g, 'W')
        .replace(/Chr|chr/g, 'cw')
        .replace(/Ove|ove/g, 'uv')
        .replace(/n([aeiou])/g, 'ny$1')
        .replace(/N([aeiou])/g, 'Ny$1')
        .replace(/N([AEIOU])/g, 'Ny$1');
}

(function () {
    console.log('Started content script');
    safe_uwuify();
})();




// uwuify notice

const modalCSS = `
#warn-layout-modal {
    position: fixed;
    z-index: 1000;
    bottom: 0;
    right: 0;
    width: 25%;
    margin: 0;
    display: none;
    height: fit-content;
    
}
#warn-layout-modal .modal-content {
    background: rgba(55, 142, 163, .7);
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    padding: 20px;
    border-top-left-radius: 5px;
    max-width: 500px;
    width: 90%;
    color: #fff;
    font-size: 1.2em;
    padding-bottom: 15%;
}
button#confirm-button, button#cancel-button {
    background: #2c8577;
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
modalIcon.src = 'https://i.imgur.com/Su2xSJr.png';
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

confirmButton.addEventListener('click', function () {
    hideModal();
    call_uwuify();
});

hideLayoutButton.addEventListener('click', function () {
    hideLayoutForever();
    hideModal();
    call_uwuify();
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
            const notif = 'this site is on uwuify\'s whitelist (' + await checkWhitelist() + '). ' +
                'Do you wish to uwuify anyway?';
            if (await checkStateLayoutModal() == true) {
                call_uwuify();
            } else {
                showModal(notif);
            }
        }
    } else {
        call_uwuify();
    }
}