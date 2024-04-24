var api = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener('DOMContentLoaded', function () {
    console.log('Started prefshandler.js');
    connect_prefs();
    populate_prefs();
});

function connect_prefs() {
    const uwu_on_btn = document.getElementById('uwuify_on_btn');
    const uwu_off_btn = document.getElementById('uwuify_off_btn');
    const uwu_re_btn = document.getElementById('uwuify_btn');
    const enable_warn_btn = document.getElementById('enable_warning');
    const get_wl_btn = document.getElementById('get_whitelist_btn');
    const close_wl_btn = document.getElementById('close_whitelist_btn');
    const refresh_wl_btn = document.getElementById('refresh_whitelist_btn');
    const clear_wl_btn = document.getElementById('clear_whitelist_btn');
    const apply_wl_btn = document.getElementById('apply_whitelist_btn');

    if (uwu_on_btn) {
        uwu_on_btn.addEventListener('click', () => {
            enableUwuify();
            populate_prefs();
        });
    }

    if (uwu_off_btn) {
        uwu_off_btn.addEventListener('click', () => {
            disableUwuify();
            populate_prefs();
        });
    }

    if (uwu_re_btn) {
        uwu_re_btn.addEventListener('click', () => {
            api.runtime.sendMessage({ action: "call_uwuify" });
        });
    }

    if (enable_warn_btn) {
        enable_warn_btn.addEventListener('click', () => {
            resetWarnings();
        });
    }

    if (get_wl_btn) {
        get_wl_btn.addEventListener('click', () => {
            window.open('whitelist.html', 'whitelist_window', 'width=500,height=500');
        });
    }

    if (close_wl_btn) {
        close_wl_btn.addEventListener('click', () => {
            window.close();
        });
    }

    if (refresh_wl_btn) {
        refresh_wl_btn.addEventListener('click', () => {
            populateWhitelist();
        });
    }

    if (apply_wl_btn) {
        apply_wl_btn.addEventListener('click', () => {
            addToWhitelist(document.getElementById('whitelist_output').value);
        });
    }

    if (clear_wl_btn) {
        clear_wl_btn.addEventListener('click', () => {
            clearWhitelist();
            logWhitelist('whitelist cleared');
        });
    }
}

function populate_prefs() {
    getState('prefs_uwuify').then(value => {
        const uwuStateElement = document.getElementById('uwu_state');
        if (uwuStateElement) {
            uwuStateElement.innerText = value === true || value === undefined ? 'on' : 'off';
        }
    });
    populateWhitelist();
}

function enableUwuify() {
    api.storage.sync.set({ prefs_uwuify: true }, function () {
        getState('prefs_uwuify').then(value => {
            // console.log(value);
        });
    });
}

function disableUwuify() {
    api.storage.sync.set({ prefs_uwuify: false }, function () {
        getState('prefs_uwuify').then(value => {
            // console.log(value);
        });
    });
}

function resetWarnings() {
    api.storage.sync.set({ hideLayoutModal: false }, function () {
        getState('hideLayoutModal').then(value => {
            // console.log(value);
        });
    });
}

function getWhitelist() {
    return new Promise((resolve, reject) => {
        api.storage.sync.get('whitelist', function (data) {
            resolve(data['whitelist'] || []);
        });
    });
}

function populateWhitelist() {
    getWhitelist().then(whitelist => {
        const wl_output = document.getElementById('whitelist_output');
        if (wl_output) {
            wl_output.value = whitelist.join(',');
            logWhitelist('whitelist loaded');
        }
    });
}

function addToWhitelist(domains) {
    let domainArray = domains.split(',');
    getWhitelist().then(whitelist => {
        let newWhitelist = [];
        domainArray.forEach(domain => {
            domain = domain.trim();
            let domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](\/[a-zA-Z0-9-._~:\/?#\[\]@!$&'()*+,;=]*)?$/;
            if (domainRegex.test(domain)) {
                newWhitelist.push(domain);
            } else {
                logWhitelist(`Invalid domain: ${domain}`);
            }
        });
        if (newWhitelist.length > 0) {
            api.storage.sync.set({ 'whitelist': newWhitelist }, function () {
                logWhitelist(`${newWhitelist} added`);
            });
        }
    });
}

function clearWhitelist() {
    api.storage.sync.set({ 'whitelist': '' }, function () {
        logWhitelist('whitelist cleared');
    });
}

function logWhitelist(data) {
    const wl_logoutput = document.getElementById('whitelist_status_output');
    if (wl_logoutput) {
        wl_logoutput.value = data;
    }
}

function getState(key) {
    return new Promise((resolve, reject) => {
        api.storage.sync.get(key, function (data) {
            resolve(data[key]);
        });
    });
}
