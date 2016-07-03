var bundless = require('bundless');
var path = require('path');
var glob = require('glob');
var fs = require('fs');
var _ = require('lodash');
var express = require('express');
var cors = require('cors');

var adapterPath = path.resolve(__dirname, 'adapter.js');
var systemJsPath = path.resolve(require.resolve('bundless'), '../../..', 'node_modules/systemjs/dist/system.js');

function escapeUrlForExpress(url) {
    return url.replace(/[$]/g, function () {
        return '[$]';
    });
}

function setupBundlessServer(bundlessConfig) {
    var app = express();
    var port = _.property(['server', 'port'])(bundlessConfig) || 5000;
    var bootstrapScript = bundless.generateBootstrapScript(bundlessConfig, { baseURL: 'http://localhost:' + port.toString() });
    app.use(cors());
    app.use(bundlessConfig.srcMount, express.static(path.resolve(bundlessConfig.srcDir)));
    app.use(bundlessConfig.libMount, express.static('node_modules'));
    app.use(escapeUrlForExpress(bundlessConfig.nodeMount), express.static(path.resolve(bundless.nodeRoot, 'node_modules')));
    app.get('/[$]bundless', function (req, res, next) {
        res.send(bootstrapScript);
    });
    return app.listen(port, function (err) {
        console.log('Bundless up and listening...');
    });
}

function addFile(config, fileName) {
    config.files.unshift({
        pattern: fileName,
        included: true,
        served: true,
        watched: false
    });
}

function initFramework(config) {
    var bundlessConfig = _.merge({}, bundless.defaultOptions, config.bundless);
    setupBundlessServer(bundlessConfig);
    config.client.bundless = bundlessConfig;
    addFile(config, adapterPath);
    addFile(config, systemJsPath);

    var specPatterns = config.bundless.specs.slice();
    var specList = [];
    var srcDir = path.resolve(bundlessConfig.srcDir);
    specPatterns.forEach(function (pattern) {
        var fileList = glob.sync(pattern);
        var urlList = fileList.map(function (fileName) {
            var fullPath = path.resolve(fileName);
            var relPath = path.relative(srcDir, fullPath);
            return bundlessConfig.srcMount.slice(1) + '/' + relPath;
        });
        specList.push.apply(specList, urlList);
    });
    config.client.bundless.specs = specList;
}
initFramework.$inject = ['config'];
module.exports = {
    'framework:bundless': ['factory', initFramework]
};
