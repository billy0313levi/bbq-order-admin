'use strict';

const sys_adds = require('./sys/adds.js');

module.exports = {
	isCloudObject: true,
	sys_adds: sys_adds.main || sys_adds
};
