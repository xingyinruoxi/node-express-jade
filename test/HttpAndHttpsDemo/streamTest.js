var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
const fs = require('fs');
var url = 'http://test-api.jintoushou.com' +   APIPath.ALICLOUD_GET_VCODE + '?type=USER_LOGIN&validateKey=123';
var stream = APIClient.get(url);
console.log(stream);