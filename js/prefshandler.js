var api = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener('DOMContentLoaded', function () {
    console.log('Started prefshandler.js');
    connect_prefs();
    populate_prefs();
});

function connect_prefs() {
    const uwu_on_btn = document.getElementById('uwuify_on_btn');
    const uwu_off_btn = document.getElementById('uwuify_off_btn');
    const moreuwu_on_btn = document.getElementById('enable_moreuwu_btn');
    const moreuwu_off_btn = document.getElementById('disable_moreuwu_btn');
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

    if (moreuwu_on_btn) {
        moreuwu_on_btn.addEventListener('click', () => {
            enable_moreuwu();
            populate_prefs();
        });
    }

    if (moreuwu_off_btn) {
        moreuwu_off_btn.addEventListener('click', () => {
            disable_moreuwu();
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
            window.open('whitelist.html', 'whitelist_window', 'width=500,height=600');
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
            populateWhitelist();
        });
    }
}

function populate_prefs() {
    const uwuify_hk_out = document.getElementById('uwuify_hotkey_display');
    const version_out = document.getElementById('version_out');
    const ps_parents = document.querySelectorAll('.pref-section');

    getState('prefs_uwuify').then(value => {
        const uwuStateInfo = document.getElementById('uwu_state');
        const uwuify_on_btn = document.getElementById('uwuify_on_btn');
        const uwuify_off_btn = document.getElementById('uwuify_off_btn');
        if (uwuStateInfo) {
            uwuStateInfo.innerText = value === true || value === undefined ? 'on' : 'off';
        }
        if(uwuify_on_btn && uwuify_off_btn) {
            uwuify_on_btn.style.border = value === true || value === undefined ? '1px solid rgb(238, 238, 238)' : '1px solid rgba(0,0,0,0)';
            uwuify_off_btn.style.border = value === false ? '1px solid rgb(238, 238, 238)' : '1px solid rgba(0,0,0,0)';
        }
    });
    getState('prefs_moreuwu').then(value => {
        const uwu_amount_info = document.getElementById('uwu_amount');
        if (uwu_amount_info) {
            uwu_amount_info.innerText = value === true ? 'on' : 'off';

            const enable_moreuwu_btn = document.getElementById('enable_moreuwu_btn');
            enable_moreuwu_btn.style.border = value === true ? '1px solid rgb(238, 238, 238)' : '1px solid rgba(0,0,0,0)';

            const disable_moreuwu_btn = document.getElementById('disable_moreuwu_btn');
            disable_moreuwu_btn.style.border = value === false || value === undefined ? '1px solid rgb(238, 238, 238)' : '1px solid rgba(0,0,0,0)';
        }
    });

    if (uwuify_hk_out) {
        var manifest = api.runtime.getManifest();
        var uwuify_hotkey = manifest.commands.call_uwuify_kb.suggested_key.linux;
        uwuify_hk_out.value = uwuify_hotkey;
    }

    if (version_out) {
        var manifest = api.runtime.getManifest();
        version_out.innerText = manifest.version;
    }

    ps_parents.forEach(function(ps_parent) {
    var main_detail = ps_parent.querySelector('.main_detail');
    if (main_detail) {
        main_detail.addEventListener('click', function() {
            var main_setting_all = document.querySelectorAll('.main_setting');
            main_setting_all.forEach(function(setting) {
                setting.style.display = 'none';
            });
            this.nextElementSibling.style.display = 'inline-block';
        });
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

function enable_moreuwu() {
    api.storage.sync.set({ prefs_moreuwu: true }, function () {
        getState('prefs_moreuwu').then(value => {
            // console.log(value);
        });
    });
}

function disable_moreuwu() {
    api.storage.sync.set({ prefs_moreuwu: false }, function () {
        getState('prefs_moreuwu').then(value => {
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
    if (confirm('Are you sure you want to delete all whitelist entries?')) {
        api.storage.sync.set({ 'whitelist': '' }, function () {
            logWhitelist('whitelist cleared');
        });
    }
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
