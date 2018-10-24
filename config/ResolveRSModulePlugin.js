const dllManifest = require('rekit-studio/build/dll-manifest.json');
const paths = require('./paths');

// This plugin resolve Rekit Studio modules in dll.

function ResolveRSModulePlugin(alias) {
  this.alias = alias || 'rs';
}

ResolveRSModulePlugin.prototype.apply = function(resolver) {
  resolver.plugin('file', (request, callback) => {
    const rsKey = `/node_modules/${this.alias}/`;
    if (request.path.indexOf(rsKey) >= 0) {
      const rsPath = request.path.replace(rsKey, '/src/');
      const mid = rsPath.replace(paths.appSrc, '.');
      console.log('mid: ', mid);
      if (dllManifest.content[mid]) {
        request.path = rsPath;
        resolver.doResolve(
          'existing-file',
          request,
          'existing file: ' + request.path,
          callback,
          true,
        );
      }
    }
    return callback();
  });
};

module.exports = ResolveRSModulePlugin;
