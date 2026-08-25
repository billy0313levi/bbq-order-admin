module.exports = {
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : 'ok' };
		let {
			_id,
			categoryLogo,
			categoryName,
			sort,
			delivery
		} = data;
		if (vk.pubfn.isNullOne(_id)) {
			return { code : -1, msg : '参数错误: _id不能为空' };
		}
		let dbName = "category";
		let dataJson = {
			categoryLogo,
			categoryName,
			sort: Number(sort) || 0,
			// 字段兼容
			name: categoryName,
			icon: categoryLogo,
			_update_time: Date.now(),
			_update_time_str: vk.pubfn.timeFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
		};
		if (typeof delivery !== 'undefined') {
			dataJson.delivery = delivery === true || delivery === 1;
			dataJson.status = (delivery === true || delivery === 1) ? 1 : 0;
		}
		await vk.baseDao.updateById({ dbName, id: _id, dataJson });
		return res;
	}
}
