module.exports = {
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : 'ok' };
		let {
			categoryLogo,
			categoryName,
			sort,
			delivery
		} = data;
		let dbName = "category";
		let dataJson = {
			categoryLogo,
			categoryName,
			sort: Number(sort) || 0,
			delivery: delivery === true || delivery === 1,
			// 字段兼容：同步写入旧字段，供前台小程序使用
			name: categoryName,
			icon: categoryLogo,
			status: (delivery === true || delivery === 1) ? 1 : 0,
			_add_time: Date.now(),
			_add_time_str: vk.pubfn.timeFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
		};
		res.id = await vk.baseDao.add({ dbName, dataJson });
		return res;
	}
}
