
var semver = require('semver')
var intersect = require('semver-set').intersect
var json = require('jju')
var mapValues = require('lodash/object/mapValues')
var pick = require('lodash/object/pick')
var assign = require('lodash/object/assign')
var isEmpty = require('lodash/lang/isEmpty')
var has = require('lodash/object/has')

var handlers = {
  // General dependencies
  dependencies: updateDependencies,
  devDependencies: updateDependencies,
  peerDependencies: updateDependencies
}

function updateDependencies (dst, src) {
  return isEmpty(dst) ? src : assign({ }, dst, mapValues(src, function (version, dep) {
    // We need to check if both are indeed semver ranges in order to do
    // intersects – some may be git urls or other such things.
    var isSem = semver.validRange(version) && semver.validRange(dst[dep])
    return isSem ? intersect(version, dst[dep]) || version : version
  }))
}

/**
 * [combine description]
 * @param {Object} dst [description]
 * @param {Object} src [description]
 * @returns {Object} [description]
 */
function combine (dst, src) {
  if (isEmpty(dst)) {
    return src
  }

  return assign({ }, dst, mapValues(pick(src, Object.keys(handlers)), function (value, key) {
    return has(handlers, key) ? handlers[key](dst[key], value) : value
  }))
}

/**
 * [merge description]
 * @param {String} dst [description]
 * @param {String} src [description]
 * @returns {String} Result of merging src into dst.
 */
function merge (dst, src) {
  return json.update(dst, combine(json.parse(dst), json.parse(src)), { })
}

module.exports = merge
