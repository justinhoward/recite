/**
 * Encodes an object into URL GET parameters.
 *
 * Object key/value pairs are converted to parameter key/value pairs.
 * Both keys and values are URL encoded.
 *
 *   Http.utils.encodeAttributes({foo: 123, bar: 'hello world'})
 *   // foo=123&bar=hello%20world
 *
 * The resulting string does not include the "?" prefix required in a
 * URL.
 *
 * @method encodeAttributes
 * @memberof Http.utils
 * @param {Object} The object of key/value pairs to encode
 * @return {string} The encoded parameters
 */
module.exports = function(attributes) {
  var encoded = [];
  for (var attr in attributes) {
    if (attributes.hasOwnProperty(attr)) {
      encoded.push(encodeURIComponent(attr) + '=' + encodeURIComponent(attributes[attr]));
    }
  }

  return encoded.join('&');
};
