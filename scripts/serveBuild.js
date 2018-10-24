// Start Rekit Studio with built plugin
// This is used to verify plugin works before publish to npm

const rekitStudio = require('rekit-studio');
rekitStudio.start({
  projectRoot: '',
  port: 6090,
  plugins: [],
});
