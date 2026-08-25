'use strict';

const del = require('./del.js');
const kh_getList = require('./kh/getList.js');
const sys_updateOrderStatus = require('./sys/updateOrderStatus.js');

module.exports = {
	isCloudObject: true,
	del: del.main || del,
	kh_getList: kh_getList.main || kh_getList,
	sys_updateOrderStatus: sys_updateOrderStatus.main || sys_updateOrderStatus
};
