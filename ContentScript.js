(function() {
    checkdynscripts();
})();

function getver() {
    return 'uwuifier-doer v0.0.3<br> made with :3 by willow<br> distributed under the MIT license';
}

function checkdynscripts() {
    if (window.location.href === ("https://willowyx.github.io/name-pending-chan/uwuify/uwu-web-standards.html" || "https://willowyx.dev/projects/uwuify")) {
        document.getElementById('ext_detect_version').innerHTML = 'yippee!! yahoo ^_^ whoopee :D<br>' +
            'you currently have uwuifier installed:<br><br>' + getver();
    }
}
