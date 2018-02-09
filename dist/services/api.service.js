function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import axios from 'axios';
import config from '../config';

var independentProtocolRegex = /^[https|http]+\:\/\//g;

export var send = function send(url) {
  var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { "X-Token": "test-token" };
  var responseType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "json";
  return axios({
    url: url,
    method: method,
    data: data,
    responseType: responseType,
    headers: headers,
    timeout: 30000
  }).then(function (_ref) {
    var _ref$data = _ref.data,
        data = _ref$data === undefined ? {} : _ref$data;
    return data;
  }, function (_ref2) {
    var _ref2$data = _ref2.data,
        data = _ref2$data === undefined ? {} : _ref2$data;
    return data;
  });
};

/**
 * Send files to airstore storage.
 * We can send 2 types of files:
 *  - files from <input type="file"/>
 *  - files from urls
 * Method understand what files we give via "data_type" attribute.
 *
 * @param uploadPath    {string}  Airstore upload url (like: "//jolipage001.api.airstore.io/upload") or custom handler
 * @param uploadParams  {object}  Params which we need to send to uploadPath
 * @param files         {array}   Array with files
 * @param data_type     {string}  Available values: "files[]", "files_url[]" (or another if you use custom handler uploadPath)
 * @returns {Promise}
 */
export var uploadFiles = function uploadFiles() {
  var files = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var _ref3 = arguments[1];
  var _ref3$uploadPath = _ref3.uploadPath,
      uploadPath = _ref3$uploadPath === undefined ? config.uploadPath : _ref3$uploadPath,
      _ref3$uploadParams = _ref3.uploadParams,
      uploadParams = _ref3$uploadParams === undefined ? {} : _ref3$uploadParams;
  var data_type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'files[]';

  var url = (uploadPath || '').replace(independentProtocolRegex, '//'); // use independent protocol
  var ajaxData = new FormData();

  uploadParams = Object.assign({}, config.uploadParams, uploadParams);

  // generate params string
  var paramsStr = Object.keys(uploadParams).filter(function (paramName) {
    return uploadParams[paramName] !== null;
  }) // do not use params with NULL value
  .map(function (paramName) {
    return paramName + '=' + uploadParams[paramName];
  }).join('&');

  if (paramsStr) url += '?' + paramsStr;

  if (files) [].concat(_toConsumableArray(files)).forEach(function (file) {
    return ajaxData.append(data_type, file);
  }); // fill FormData

  return new Promise(function (resolve, reject) {
    send(url, 'POST', ajaxData).then(function (response) {
      var _response$status = response.status,
          status = _response$status === undefined ? 'success' : _response$status,
          _response$files = response.files,
          files = _response$files === undefined ? [] : _response$files;


      if (status === 'success' && files && files.length) resolve(files.map(function (file) {
        file.public_link = file.public_link.replace(independentProtocolRegex, '//');

        return file;
      }));else reject(response);
    }, function (error) {
      if (error.code === 'ECONNABORTED') console.warn('Network seems not good :(');

      reject(error);
    });
  });
};