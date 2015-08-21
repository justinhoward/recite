module.exports = function(attributes) {
  var encoded = [];
  for (var attr in attributes) {
    if (attributes.hasOwnProperty(attr)) {
      encoded.push(encodeURIComponent(attr) + '=' + encodeURIComponent(attributes[attr]));
    }
  }

  return encoded.join('&');
};
