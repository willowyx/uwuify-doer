var api = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener('DOMContentLoaded', async function () {
    console.log('Started prefshandler.js');
    connect_prefs();
    await populate_prefs();
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
    const mv3_btn = document.getElementById('mv3_permissions_btn');
    const mv3_sbtn = document.getElementById('mv3_permissions_sbtn');
    const accent_default = document.getElementById('accent_default');
    const accent_nocturne = document.getElementById('accent_night');
    const accent_downpour = document.getElementById('accent_downpour');
    const accent_velvet = document.getElementById('accent_velvet');
    const accent_trans = document.getElementById('accent_trans');
    const notif_main = document.getElementById('notif_main');

    if (uwu_on_btn) {
        uwu_on_btn.addEventListener('click', async () => {
            enableUwuify();
            await populate_prefs();
        });
    }

    if (uwu_off_btn) {
        uwu_off_btn.addEventListener('click', async () => {
            disableUwuify();
            await populate_prefs();
        });
    }

    if (moreuwu_on_btn) {
        moreuwu_on_btn.addEventListener('click', async () => {
            enable_moreuwu();
            await populate_prefs();
        });
    }

    if (moreuwu_off_btn) {
        moreuwu_off_btn.addEventListener('click', async () => {
            disable_moreuwu();
            await populate_prefs();
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
            window.location.href = 'whitelist.html';
        });
    }

    if (close_wl_btn) {
        close_wl_btn.addEventListener('click', async () => {
            await addToWhitelist(document.getElementById('whitelist_output').value).then(() => {
                history.back();
            });
        });
    }

    if (refresh_wl_btn) {
        refresh_wl_btn.addEventListener('click', async () => {
            await populateWhitelist();
        });
    }

    if (apply_wl_btn) {
        apply_wl_btn.addEventListener('click', async () => {
            await applyWhitelist();
        });
    }

    if (clear_wl_btn) {
        clear_wl_btn.addEventListener('click', async () => {
            await clearWhitelist();
            await populateWhitelist();
        });
    }

    if (accent_nocturne) {
        accent_nocturne.addEventListener('click', () => {
            applytheme('nocturne');
        });
    }

    if (accent_velvet) {
        accent_velvet.addEventListener('click', () => {
            applytheme('velvet');
        });
    }

    if (accent_trans) {
        accent_trans.addEventListener('click', () => {
            applytheme('trans');
        });
    }

    if (accent_downpour) {
        accent_downpour.addEventListener('click', () => {
            applytheme('downpour');
        });
    }

    if (accent_default) {
        accent_default.addEventListener('click', () => {
            applytheme('default');
        });
    }

    if (notif_main) {
        notif_main.addEventListener('click', () => {
            notif_main.classList.add('hidden-noint');
            api.storage.sync.set({ main_notif_allow: false });
        });
    }

    if (mv3_btn) {
        mv3_btn.addEventListener('click', async () => {
            const granted = await api.permissions.request({ origins: ["<all_urls>"] });
            if (granted) {
                alert('[Permission granted] Initialization complete!');
                hide_mv3_main();
            } else {
                alert('[Permission denied] You can always enable this later!');
            }
        });
        if (getBrowserType() == 'Chrome') {
            hide_mv3_main();
        }
    }

    if (mv3_sbtn) {
        mv3_sbtn.addEventListener('click', () => {
            mv3_btn.click();
        });
    }
}

async function populate_prefs() {
    const version_out = document.getElementById('version_out');
    const ps_parents = document.querySelectorAll('.pref-section');

    getState('prefs_uwuify').then(value => {
        const uwuStateInfo = document.getElementById('uwu_state');
        const uwuify_on_btn = document.getElementById('uwuify_on_btn');
        const uwuify_off_btn = document.getElementById('uwuify_off_btn');
        if (uwuStateInfo) {
            uwuStateInfo.innerText = value === true || value === undefined ? 'on' : 'off';
        }
        if (uwuify_on_btn && uwuify_off_btn) {
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
    getState('prefs_themepreset').then(value => {
        if (value === 'nocturne') {
            applytheme('nocturne');
        }
        if (value === 'downpour') {
            applytheme('downpour');
        }
        if (value === 'velvet') {
            applytheme('velvet');
        }
        if (value === 'trans') {
            applytheme('trans');
        }
        if (value === 'default') {
            applytheme('default');
        }
    });
    if (version_out) {
        var manifest = api.runtime.getManifest();
        version_out.innerText = manifest.version;
    }

    ps_parents.forEach(function (ps_parent) {
        var main_detail = ps_parent.querySelector('.main_detail');
        if (main_detail) {
            main_detail.addEventListener('click', function () {
                var main_setting_all = document.querySelectorAll('.main_setting');
                main_setting_all.forEach(function (setting) {
                    setting.style.display = 'none';
                });
                this.nextElementSibling.style.display = 'inline-block';
            });
        }
    });

    const notif_main = document.getElementById('notif_main');
    if (notif_main) {
        if ((await getState('main_notif_allow')) !== false) {
            document.getElementById('notif_main').classList.remove('hidden-noint');
        }
    }

    await populateWhitelist();
}

function resetTheme() {
    Array.from(document.getElementsByTagName('input')).forEach(function (el) {
        el.classList.remove('nightbtn');
        el.classList.remove('rainbtn');
        el.classList.remove('velvetbtn');
        el.classList.remove('transbtn');
    });
    Array.from(document.getElementsByTagName('a')).forEach(function (el) {
        el.style.color = '#fff';
    });
    Array.from(document.querySelectorAll('.main_setting')).forEach(function (el) {
        el.classList.remove('velvetbg');
        el.classList.remove('transbg');
        el.classList.remove('nightbg');
        el.classList.remove('rainbg');
    });
    document.body.classList.remove('nightbg');
    document.body.classList.remove('rainbg');
    document.body.classList.remove('velvetbg');
    document.body.classList.remove('transbg');
}

function applytheme(theme) {
    resetTheme();
    if (theme == 'default') {
        api.storage.sync.set({ prefs_themepreset: 'default' });
    }
    if (theme == 'nocturne') {
        Array.from(document.getElementsByTagName('input')).forEach(function (el) {
            el.classList.add('nightbtn');
        });
        document.body.classList.add('nightbg');
        Array.from(document.querySelectorAll('.main_setting')).forEach(function (el) {
            el.classList.add('nightbg');
        });
        api.storage.sync.set({ prefs_themepreset: 'nocturne' });
    }
    if (theme == 'downpour') {
        Array.from(document.getElementsByTagName('input')).forEach(function (el) {
            el.classList.add('rainbtn');
        });
        document.body.classList.add('rainbg');
        Array.from(document.querySelectorAll('.main_setting')).forEach(function (el) {
            el.classList.add('rainbg');
        });
        api.storage.sync.set({ prefs_themepreset: 'downpour' });
    }
    if (theme == 'velvet') {
        Array.from(document.getElementsByTagName('input')).forEach(function (el) {
            el.classList.add('velvetbtn');
        });
        document.body.classList.add('velvetbg');
        Array.from(document.querySelectorAll('.main_setting')).forEach(function (el) {
            el.classList.add('velvetbg');
        });
        api.storage.sync.set({ prefs_themepreset: 'velvet' });
    }
    if (theme == 'trans') {
        Array.from(document.getElementsByTagName('input')).forEach(function (el) {
            el.classList.add('transbtn');
        });
        document.body.classList.add('transbg');
        Array.from(document.querySelectorAll('.main_setting')).forEach(function (el) {
            el.classList.add('transbg');
        });
        api.storage.sync.set({ prefs_themepreset: 'trans' });
    }
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
    api.storage.sync.set({ hideLayoutModal: false });
    api.storage.sync.set({ main_notif_allow: true });
}

function getWhitelist() {
    return new Promise((resolve, reject) => {
        api.storage.sync.get('whitelist', function (data) {
            resolve(data['whitelist'] || []);
        });
    });
}

async function applyWhitelist() {
    await addToWhitelist(document.getElementById('whitelist_output').value);
}

async function populateWhitelist() {
    getWhitelist().then(whitelist => {
        const wl_output = document.getElementById('whitelist_output');
        if (wl_output) {
            wl_output.value = whitelist.join(',');
            logWhitelist('whitelist loaded');
        }
    });
}

async function addToWhitelist(domains) {
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

async function clearWhitelist() {
    if (confirm('Delete all whitelist entries?')) {
        api.storage.sync.set({ 'whitelist': '' }, function () {
            // logWhitelist('whitelist cleared');
        });
    }
}

function logWhitelist(data) {
    const wl_logoutput = document.getElementById('whitelist_status_output');
    if (wl_logoutput) {
        wl_logoutput.value = data;
    }
}

function getBrowserType() {
    const userAgent = navigator.userAgent;
    if (/Firefox/i.test(userAgent)) {
        return 'Firefox';
    } else if (/Chrome/i.test(userAgent)) {
        return 'Chrome';
    }
}

function hide_mv3_main() {
    const mv3_main = document.getElementById('mv3_main');
    const mv3_complete = document.getElementById('mv3_complete');

    if (mv3_main) {
        mv3_main.style.display = 'none';
    }

    if (mv3_complete) {
        mv3_complete.style.display = 'inline-block';
    }
}

function getState(key) {
    return new Promise((resolve, reject) => {
        api.storage.sync.get(key, function (data) {
            resolve(data[key]);
        });
    });
}
