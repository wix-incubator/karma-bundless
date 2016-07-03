(function (karma) {
    function loadScript(url) {
        return new Promise(function (resolve, reject) {
            var element = document.createElement('script');
            element.setAttribute('src', url);
            element.addEventListener('load', function () {
                resolve();
            });
            element.addEventListener('error', function () {
                reject('Failed to load ' + url);
            });
            document.body.appendChild(element);
        });
    }

    karma.loaded = function () {};
    var config = karma.config.bundless;
    var port = (karma.config.bundless && karma.config.bundless.server && karma.config.bundless.server.port) || 5000;
    return Promise.resolve()
        .then(function () {
            return loadScript('http://localhost:' + port + '/$bundless');
        })
        .then(function () {
            window['projectMap'] = $bundless(System);
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
            karma.start();
        });


})(window.__karma__);
