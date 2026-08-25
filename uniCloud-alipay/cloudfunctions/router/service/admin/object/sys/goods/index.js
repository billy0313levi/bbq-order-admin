'use strict';

const add = require('./add.js');
const del = require('./del.js');
const edit = require('./edit.js');
const kh_getList = require('./kh/getList.js');
const sys_updateIsOnSale = require('./sys/updateIsOnSale.js');

module.exports = {
	isCloudObject: true,
	add: add.main || add,
	del: del.main || del,
	edit: edit.main || edit,
	kh_getList: kh_getList.main || kh_getList,
	sys_updateIsOnSale: sys_updateIsOnSale.main || sys_updateIsOnSale
};
