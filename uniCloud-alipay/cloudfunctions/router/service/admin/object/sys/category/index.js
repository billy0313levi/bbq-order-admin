'use strict';

const add = require('./add.js');
const del = require('./del.js');
const edit = require('./edit.js');
const kh_getList = require('./kh/getList.js');
const kh_findCategoryByUid = require('./kh/findCategoryByUid.js');
const sys_updateIsOnSale = require('./sys/updateIsOnSale.js');
const sys_addGoodsUnderCategoryToestimate = require('./sys/addGoodsUnderCategoryToestimate.js');

module.exports = {
	isCloudObject: true,
	add: add.main || add,
	del: del.main || del,
	edit: edit.main || edit,
	kh_getList: kh_getList.main || kh_getList,
	kh_findCategoryByUid: kh_findCategoryByUid.main || kh_findCategoryByUid,
	sys_updateIsOnSale: sys_updateIsOnSale.main || sys_updateIsOnSale,
	sys_addGoodsUnderCategoryToestimate: sys_addGoodsUnderCategoryToestimate.main || sys_addGoodsUnderCategoryToestimate
};
