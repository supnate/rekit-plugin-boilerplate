'use strict';

const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
let config = require('../config/webpack.config.prod');
const printBuildError = require('react-dev-utils/printBuildError');
const paths = require('../config/paths');

function buildPlugin(pluginName) {
  console.log(`Building plugin: ${pluginName}`);
  const pluginDir = path.join(__dirname, '../src/features', pluginName);
  const buildDir = path.join(pluginDir, 'build');
  const indexJs = path.join(pluginDir, 'entry.js');
  const indexStyle = path.join(pluginDir, 'style.less');
  config = {
    ...config,
    entry: [indexJs, indexStyle],
    output: {
      path: buildDir,
    },
    plugins: [
      ...config.plugins,
      new webpack.DllReferencePlugin({
        context: paths.appSrc,
        manifest: require('rekit-studio/build/dll-manifest.json'),
      }),
    ],
  };

  fs.emptyDirSync(buildDir);
  const publicDir = path.join(pluginDir, 'public');
  if (fs.existsSync(publicDir)) fs.copySync(publicDir, buildDir);

  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        printBuildError(err);
        return reject(err);
      }
      console.log(`${pluginName} done.`);

      return resolve();
    });
  });
}

module.exports = buildPlugin;
