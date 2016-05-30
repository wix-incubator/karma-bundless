function loadScript(url) {
    return new Promise(function (resolve, reject) {
        var element = document.createElement('script');
        element.setAttribute('src', url);
        element.addEventListener('load', function () {
            resolve();
        });
        element.addEventListener('error', function () {
            reject('Failed to load $system.')
        });
        document.body.appendChild(element);
    });
}
var prevStartFn = window.__karma__.start.bind(window.__karma__);

window.__karma__.start = function () {
    var baseUrl = 'http://' + (__karma__.config.bundless.server.host || 'localhost') + ':' + (__karma__.config.bundless.server.port);
    loadScript(baseUrl + __karma__.config.bundless.server.systemMount)
        .then(function () {
            var scripts = __karma__.config.bundless.scripts || [];
            return Promise.all(scripts.map(loadScript));
        })
        .then(function () {
            var allModules = __karma__.config.bundless.specs.map(function (moduleName) {
                return System.import(System.baseURL + moduleName);
            });
            return Promise.all(allModules);
        })
        .then(function () {
            prevStartFn.apply(null, arguments);
        });
};

