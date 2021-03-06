var intToBytes = function(i, byteSize) {
  var buf = new Buffer(byteSize);
  for (var x = 0; x < byteSize; x++) {
    buf[x] = i >> (x * 8);
  }
  return buf;
};

var unixtime = function(i) {
  if (isNaN(i) || i < 0) {
    throw new Error('Unix time must be positive');
  }
  return intToBytes(i, unixtime.BYTES);
};
unixtime.BYTES = 4;

var uint8 = function(i) {
  if (isNaN(i) || i < 0 || i > 255) {
    throw new Error('int be in range 0..255');
  }
  return intToBytes(i, uint8.BYTES);
};
uint8.BYTES = 1;

var uint16 = function(i) {
  if (isNaN(i) || i < 0 || i > 65535) {
    throw new Error('int be in range 0..65535');
  }
  return intToBytes(i, uint16.BYTES);
};
uint16.BYTES = 2;

var latLng = function(latitude, longitude) {
  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90° and 90°');
  }
  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180° and 180°');
  }

  return Buffer.concat([
    intToBytes(latitude * 1e6, latLng.BYTES / 2),
    intToBytes(longitude * 1e6, latLng.BYTES / 2)
  ]);
};
latLng.BYTES = 8;

var temperature = function(i) {

  if (isNaN(i) || i < -327.68 || i > 327.67) {
    throw new Error('Temperature must be in range -327.68..327.67');
  }
  var t = i * 1e2;
  if(i < 0) {
    t = ~t;
    t = t + 1;
  }
  return intToBytes(t, temperature.BYTES);
};
temperature.BYTES = 2;

var humidity = function(i) {
  if (isNaN(i) || i < 0 || i > 100) {
    throw new Error('Humidity must be in range 0..100');
  }

  return intToBytes(i * 1e2, humidity.BYTES);
};
humidity.BYTES = 2;

var encode = function(values, mask) {
  if (!Array.isArray(values)) {
    throw new Error('Values must be an array');
  }
  if (!Array.isArray(mask)) {
    throw new Error('Mask must be an array');
  }
  if (values.length > mask.length) {
    throw new Error('Mask length is ' + mask.length + ' whereas input is ' + values.length);
  }

  return Buffer.concat(values
    .map(function(args, i) {
      return mask[i].apply(null, Array.isArray(args) ? args : [args]);
    }));
};

if (typeof module === 'object' && typeof module.exports !== 'undefined') {
  module.exports = {
    unixtime: unixtime,
    uint8: uint8,
    uint16: uint16,
    temperature: temperature,
    humidity: humidity,
    latLng: latLng,
    encode: encode
  };
}
