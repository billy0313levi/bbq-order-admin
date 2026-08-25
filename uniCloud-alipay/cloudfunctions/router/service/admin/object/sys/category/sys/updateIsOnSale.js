module.exports = {
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let res = { code : 0, msg : 'ok' };
		let { ids = [], delivery } = data;
		if (!Array.isArray(ids) || ids.length === 0) {
			return { code : -1, msg : '参数错误: ids不能为空' };
		}
		let dbName = "category";
		let whereJson = { _id: _.in(ids) };
		let dataJson = {
			delivery: delivery === true || delivery === 1,
			status: (delivery === true || delivery === 1) ? 1 : 0,
			_update_time: Date.now(),
			_update_time_str: vk.pubfn.timeFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
		};
		res.num = await vk.baseDao.update({ dbName, whereJson, dataJson });
		return res;
	}
}
