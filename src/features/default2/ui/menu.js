import store from 'rs/common/store';

const byId = id => store.getState().home.elementById[id];

export default {
  contextMenu: {
    fillMenuItems(items, { elementId }) {
      const ele = byId(elementId);
      if (!ele) return;
      items.push({ name: 'Test plugin', key: 'test-plugin' });
    },
    handleMenuClick({ elementId, key }) {
      if (key === 'test-plugin') {
        alert('hello plugin2');
      }
    },
  },
};
