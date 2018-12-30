const test = require('./test');

module.exports = {
  afterAddComponent(name, args) {
    console.log('after add component: ', arguments);
    test.add('component', name, args);
  },
};
