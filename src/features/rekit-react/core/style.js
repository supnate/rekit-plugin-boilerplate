'use strict';

/**
 * Style manager. It manage style files for components. Usually used with component manage.
 * @module
 **/
const path = require('path');
const _ = require('lodash');
const entry = require('./entry');
const utils = require('./utils');

const { vio, template } = rekit.core;

/**
 * Add a style file for a component. It create the style file with the extension 'cssExt' configured in 'rekit' section of package.json.
 * @param {string} feature - The feature name.
 * @param {string} component - The component name.
 * @alias module:style.add
 *
 * @example
 * const style = require('rekit-core').style;
 *
 * // create a file named 'Hello.less' in feature 'home'.
 * style.add('home', 'Hello');
 **/
function add(ele, args) {
  // Create style file for a component
  // const ele = utils.parseElePath(elePath, 'style');
  template.generate(
    ele.stylePath,
    Object.assign({}, args, {
      templateFile: path.join(__dirname, './templates/Component.less.tpl'),
      context: Object.assign(
        {
          ele,
        },
        args.context || {}
      ),
    })
  );

  entry.addToStyle(ele);
}

/**
 * Remove a style file for a component.
 * @param {string} feature - The feature name.
 * @param {string} component - The component name.
 * @alias module:style.remove
 *
 **/
function remove(ele) {
  // Remove style file of a component
  // const ele = utils.parseElePath(elePath, 'style');
  vio.del(ele.stylePath);
  entry.removeFromStyle(ele);
}

/**
 * Move/rename a style file for a component.
 * @param {string} feature - The feature name.
 * @param {string} component - The component name.
 * @alias module:style.remove
 *
 **/
function move(sourceEle, targetEle) {
  // 1. Move File.less to the destination
  // 2. Rename css class name
  // 3. Update references in the style.less

  // source.feature = _.kebabCase(source.feature);
  // source.name = _.pascalCase(source.name);
  // target.feature = _.kebabCase(target.feature);
  // target.name = _.pascalCase(target.name);

  // const srcPath = utils.mapComponent(source.feature, source.name) + '.' + utils.getCssExt();
  // const targetPath = utils.mapComponent(target.feature, target.name) + '.' + utils.getCssExt();
  vio.move(sourceEle.stylePath, targetEle.stylePath);

  let lines = vio.getLines(targetEle.stylePath);
  const oldCssClass = `${_.kebabCase(sourceEle.feature)}-${_.kebabCase(sourceEle.name)}`;
  const newCssClass = `${_.kebabCase(targetEle.feature)}-${_.kebabCase(targetEle.name)}`;

  lines = lines.map(line => line.replace(`.${oldCssClass}`, `.${newCssClass}`));
  vio.save(targetEle.stylePath, lines);

  if (sourceEle.feature === targetEle.feature) {
    entry.renameInStyle(sourceEle.feature, sourceEle.name, targetEle.name);
  } else {
    entry.removeFromStyle(sourceEle);
    entry.addToStyle(targetEle);
  }
}

module.exports = {
  add,
  move,
  remove,
};
