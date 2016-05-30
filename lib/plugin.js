var bundless = require('bundless').default;
var getConfiguration = require('bundless').getConfiguration;
var path = require('path');
var adapterPath = path.resolve(__dirname, 'adapter.js');
var glob = require('glob');

function initFramework(config) {
    config.client.bundless = config.bundless;
    var serverConf = getConfiguration(config.bundless.server || {});
    config.client.bundless.server = serverConf;
    config.files.unshift({
        pattern: adapterPath,
        included: true,
        served: true,
        watched: false
    });
    var specPatterns = config.bundless.specs.slice();
    var specList = [];
    var srcDir = path.resolve(serverConf.srcDir);
    specPatterns.forEach(function (pattern) {
        var fileList = glob.sync(pattern);
        var urlList = fileList.map(function (fileName) {
            var fullPath = path.resolve(fileName);
            var relPath = path.relative(srcDir, fullPath);
            return serverConf.srcMount.slice(1) + '/' + relPath;
        });
        specList.push.apply(specList, urlList);
    });
    config.bundless.specs = specList;
    bundless(serverConf).listen(serverConf.port || 5000, function (err) {
        if(err) {
            console.error(err);
        } else {
            console.log('Bundless up and listening at', this.address());
        }
    });
}
initFramework.$inject = ['config'];
module.exports = {
    'framework:bundless': ['factory', initFramework]
};
