'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.GENERATE_SOURCEMAP = false;

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');
const fs = require('fs-extra');
const path = require('path');
const buildPlugin = require('./buildPlugin');

if (process.argv[2]) buildPlugin(process.argv[2]);
else {
  const featuresDir = path.join(__dirname, '../src/features');
  const files = fs.readdirSync(featuresDir);

  files.forEach(f => {
    const absFile = path.join(featuresDir, f);
    if (!fs.statSync(absFile).isDirectory() || !fs.existsSync(path.join(absFile, 'entry.js')))
      return;
    buildPlugin(f);
  });
}
