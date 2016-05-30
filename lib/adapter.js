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
    var config = __karma__.config.bundless;
    var host = config.server.host || 'localhost';
    var port = config.server.port || 5000;
    var baseUrl = 'http://' + host + ':' + port;
    loadScript(baseUrl + config.server.systemMount)
        .then(function () {
            var scripts = config.scripts || [];
            return Promise.all(scripts.map(loadScript));
        })
        .then(function () {
            var allModules = config.specs.map(function (moduleName) {
                return System.import(System.baseURL + moduleName);
            });
            return Promise.all(allModules);
        })
        .then(function () {
            prevStartFn.apply(null, arguments);
        });
};

