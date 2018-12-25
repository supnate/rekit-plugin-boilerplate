const _ = require('lodash');
const path = require('path');
// const shell = require('shelljs');
const traverse = require('babel-traverse').default;

const { ast, paths, vio, app, config, files } = rekit.core;

let elementById = {};
const filePropsCache = {};

function getFileProps(file) {
  if (filePropsCache[file] && filePropsCache[file].content === vio.getContent(file)) {
    return filePropsCache[file].props;
  }

  const name = path.basename(file);
  let isComponent = false;
  let isAction = false;

  // If it's pascal case and has same style file, it's a component
  if (
    /^[A-Z][a-zA-Z0-9]*\.jsx?$/.test(name) &&
    vio.fileExists(file.replace(/\.jsx?$/, `.${config.style}`))
  ) {
    isComponent = true;
  }

  // Files under redux folder are all actions excepts actions.js|constants.js|reducer.js|initialState.js
  if (
    /^src\/features\/[\w\d-]+\/redux\/[\w.]+$/.test(file) &&
    !['actions.js', 'constants.js', 'reducer.js', 'initialState.js'].includes(name)
  ) {
    isAction = true;
  }

  const fileAst = ast.getAst(file);
  const ff = {}; // File features

  traverse(fileAst, {
    ImportDeclaration(path) {
      switch (path.node.source.value) {
        case 'react':
          ff.importReact = true;
          break;
        case 'redux':
          ff.importRedux = true;
          break;
        case 'react-redux':
          ff.importReactRedux = true;
          break;
        case './constants':
          ff.importConstant = true;
          ff.importMultipleConstants = path.node.specifiers.length > 3;
          break;
        default:
          break;
      }
    },
    ClassDeclaration(path) {
      if (
        path.node.superClass &&
        path.node.body.body.some(n => n.type === 'ClassMethod' && n.key.name === 'render')
      ) {
        ff.hasClassAndRenderMethod = true;
      }
    },
    CallExpression(path) {
      if (path.node.callee.name === 'connect') {
        ff.connectCall = true;
      }
    },
    ExportNamedDeclaration(path) {
      if (_.get(path, 'node.declaration.id.name') === 'reducer') {
        ff.exportReducer = true;
      }
    },
  });
  const props = {
    component: isComponent && {
      connectToStore: ff.importReactRedux && ff.connectCall,
    },
    action: isAction && {
      isAsync: ff.importMultipleConstants,
    },
    syntaxError: !fileAst,
  };

  if (props.component) props.type = 'component';
  else if (props.action) props.type = 'action';

  filePropsCache[file] = {
    content: vio.getContent(file),
    props,
  };
  return props;
}

function getComponents(feature) {
  const components = [];
  const eleFolder = elementById[`src/features/${feature}`];
  eleFolder.children.map(eid => elementById[eid]).forEach(ele => {
    if (ele.type === 'file' && /\.jsx?$/.test(ele.name) && getFileProps(ele.id).component) {
      const styleFile = ele.id.replace(/\.jsx?$/, `.${rekit.core.config.style}`);
      const testFile = ele.id.replace(/^src\//, 'tests/').replace(/\.jsx?$/, '.test.js');
      const views = [
        { key: 'diagram', name: 'Diagram' },
        { key: 'code', name: 'Code', target: ele.id, isDefault: true },
        { key: 'style', name: 'Style', target: styleFile },
        { key: 'test', name: 'Test', target: testFile },
      ];
      const id = `v:${ele.id}`;
      const parts = [ele.id, styleFile, testFile];
      const name = ele.name.replace(/\.[^.]*$/, '');
      components.push({
        type: 'component',
        id,
        name,
        props: getFileProps(ele.id).component,
        views,
        parts,
      });
    }
  });

  components.forEach(c => {
    elementById[c.id] = c;
  });
  return components.map(c => c.id);
}

function getActions(feature) {
  const actions = [];
  const eleFolder = elementById[`src/features/${feature}/redux`];
  if (!eleFolder) return [];
  eleFolder.children.map(eid => elementById[eid]).forEach(ele => {
    if (ele.type === 'file' && /\.js$/.test(ele.name) && getFileProps(ele.id).action) {
      const testFile = ele.id.replace(/^src\//, 'tests/').replace(/\.js$/, '.test.js');
      const views = [
        { key: 'diagram', name: 'Diagram' },
        { key: 'code', name: 'Code', target: ele.id, isDefault: true },
        { key: 'test', name: 'Test', target: testFile },
      ];
      const id = `v:${ele.id}`;
      const parts = [ele.id, testFile];
      actions.push({
        type: 'action',
        id,
        name: ele.name.replace(/\.[^.]*$/, ''),
        props: getFileProps(ele.id).action,
        views,
        parts,
      });
    }
  });

  actions.forEach(c => {
    elementById[c.id] = c;
  });
  return actions.map(c => c.id);
}

function getRootRoutePath() {
  const targetPath = 'src/common/routeConfig.js';
  const theAst = ast.getAst(targetPath);
  let rootPath = '';
  traverse(theAst, {
    ObjectExpression(path) {
      const node = path.node;
      const props = node.properties;
      if (!props.length) return;
      const obj = {};
      props.forEach(p => {
        if (_.has(p, 'key.name') && !p.computed) {
          obj[p.key.name] = p;
        }
      });
      if (obj.path && obj.childRoutes && !rootPath) {
        rootPath = _.get(obj.path, 'value.value');
      }
    },
  });
  return rootPath;
}

/**
 * Get route rules defined in a feature.
 * @param {string} feature - The feature name.
 */
function getRoutes(feature) {
  const targetPath = `src/features/${feature}/route.js`; //utils.mapFeatureFile(feature, 'route.js');
  if (vio.fileNotExists(targetPath)) return [];
  const theAst = ast.getAst(targetPath);
  const arr = [];
  let rootPath = '';
  let indexRoute = null;

  traverse(theAst, {
    ObjectExpression(path) {
      const node = path.node;
      const props = node.properties;
      if (!props.length) return;
      const obj = {};
      props.forEach(p => {
        if (_.has(p, 'key.name') && !p.computed) {
          obj[p.key.name] = p;
        }
      });
      if (obj.path && obj.component) {
        // in a route config, if an object expression has both 'path' and 'component' property, then it's a route config
        arr.push({
          path: _.get(obj.path, 'value.value'), // only string literal supported
          component: _.get(obj.component, 'value.name'), // only identifier supported
          isIndex: !!obj.isIndex && _.get(obj.isIndex, 'value.value'), // suppose to be boolean
          node: {
            start: node.start,
            end: node.end,
          },
        });
      }
      if (obj.isIndex && obj.component && !indexRoute) {
        // only find the first index route
        indexRoute = {
          component: _.get(obj.component, 'value.name'),
        };
      }
      if (obj.path && obj.childRoutes && !rootPath) {
        rootPath = _.get(obj.path, 'value.value');
        if (!rootPath) rootPath = '$none'; // only find the first rootPath
      }
    },
  });
  const prjRootPath = getRootRoutePath();
  if (rootPath === '$none') rootPath = prjRootPath;
  else if (!/^\//.test(rootPath)) rootPath = prjRootPath + '/' + rootPath;
  rootPath = rootPath.replace(/\/+/, '/');
  arr.forEach(item => {
    if (!/^\//.test(item.path)) {
      item.path = (rootPath + '/' + item.path).replace(/\/+/, '/');
    }
  });
  if (indexRoute) {
    indexRoute.path = rootPath;
    arr.unshift(indexRoute);
  }
  return arr;
}

// function getFiles(feature) {
//   const res = app.readDir(paths.map(`src/features/${feature}`));
//   Object.assign(elementById, res.elementById);
//   return res.elements;
// }

function getInitialState(feature) {
  const id = `v:${feature}-initial-state`;
  const codeFile = `src/features/${feature}/redux/initialState.js`;
  const ele = {
    id,
    type: 'initial-state',
    target: codeFile,
    parts: [codeFile],
    name: 'initialState',
  };
  elementById[id] = ele;
  return ele;
}

function getFeatures() {
  // return _.toArray(shell.ls(rekit.core.paths.map('src/features')));
  const elements = [];
  const eles = elementById['src/features'].children.map(eid => elementById[eid]);
  eles.forEach(ele => {
    if (ele.type !== 'folder') {
      elements.push(ele.id);
      return;
    }
    // feature name
    const f = ele.id.split('/').pop();
    const routes = getRoutes(f);
    const actions = getActions(f);
    const components = getComponents(f);

    actions.unshift(getInitialState(f).id);

    const routeFilePath = `src/features/${f}/route.js`;
    const children = [
      {
        id: `v:${f}-routes`,
        type: 'routes',
        name: 'Routes',
        feature: f,
        parts: [routeFilePath],
        views: [
          { key: 'diagram', name: 'Diagram' },
          { key: 'rules', name: 'Rules' },
          { key: 'code', name: 'Code', target: routeFilePath, isDefault: true },
        ],
        routes,
      },
      {
        id: `v:${f}-actions`,
        type: 'actions',
        name: 'Actions',
        children: actions,
      },
      {
        id: `v:${f}-components`,
        type: 'components',
        name: 'Components',
        children: components,
      },
    ];

    const toRemoveFromMisc = {};
    const generateToRemoveFromMisc = children =>
      children.map(eid => (typeof eid === 'string' ? elementById[eid] : eid)).forEach(ele => {
        if (ele.parts) {
          ele.parts.forEach(p => {
            toRemoveFromMisc[p] = true;
          });
        }
        if (ele.children) generateToRemoveFromMisc(ele.children);
      });
    generateToRemoveFromMisc(children);

    const filterNonMisc = children => {
      const filtered = children.filter(cid => !toRemoveFromMisc[cid]);
      filtered.map(cid => elementById[cid]).forEach(c => {
        if (c.children) c.children = filterNonMisc(c.children);
      });
      return filtered;
    };
    const misc = filterNonMisc(elementById[`src/features/${f}`].children);
    children.push({
      id: `v:${f}-misc`,
      target: `src/features/${f}`,
      type: 'folder-alias',
      name: 'Misc',
      children: misc,
    });

    const id = `v:feature-${f}`;
    elements.push(id);
    elementById[id] = {
      type: 'feature',
      id,
      name: f,
      children: children.map(c => c.id),
    };
    children.forEach(c => {
      elementById[c.id] = c;
    });
  });
  return elements;
}

function getProjectData() {
  const srcFiles = files.readDir(paths.map('src'), true);
  const testFiles = files.readDir(paths.map('tests'), true);
  elementById = { ...srcFiles.elementById, ...testFiles.elementById };

  const eleFeatures = {
    type: 'features',
    id: 'v:features',
    name: 'Features',
    children: getFeatures(),
  };

  const eleMisc = {
    type: 'folder-alias',
    id: 'v:_src-misc',
    name: 'Misc',
    target: 'src',
    children: srcFiles.elements.filter(eid => eid !== 'src/features'),
  };

  const elements = [];

  [eleFeatures, eleMisc].forEach(ele => {
    elements.push(ele.id);
    elementById[ele.id] = ele;
  });
  const folders = config.getRekitConfig().folders || [];
  folders.forEach(f => {
    const res = files.readDir(paths.map(f));
    Object.assign(elementById, res.elementById);

    const folderEle = {
      type: 'folder-alias',
      id: 'v:folder-' + f,
      name: f,
      target: f,
      children: res.elements,
    };
    elementById[folderEle.id] = folderEle;
    elements.splice(1, 0, folderEle.id);
  });

  const extraFiles = config.getRekitConfig().files || [];
  extraFiles.forEach(f => {
    const fileEle = files.getFileElement(paths.map(f));
    // Object.assign(elementById, { [fileEle.id]: fileEle });

    // const folderEle = {
    //   type: 'folder-alias',
    //   id: 'v:folder-' + f,
    //   name: f,
    //   target: f,
    //   children: res.elements,
    // };
    elementById[fileEle.id] = fileEle;
    elements.push(fileEle.id);
  });

  return { elements, elementById };
}

module.exports = {
  getProjectData,
  getFileProps,
};
