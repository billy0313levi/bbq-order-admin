module.exports = {
	main: async (event) => {
		let { data = [], userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let res = { code : 0, msg : 'ok' };
		if (!Array.isArray(data) || data.length === 0) {
			return { code : -1, msg : '参数错误: 估清单不能为空' };
		}
		let dbName = "estimate";
		// 先检查是否已存在相同 goodsId 的估清，存在则跳过
		let goodsIds = data.map(x => x.goodsId).filter(Boolean);
		let existing = [];
		try {
			let existingRes = await vk.baseDao.selects({
				dbName,
				whereJson: { goodsId: _.in(goodsIds) },
				fieldJson: { goodsId: true },
				limit: 1000
			});
			existing = (existingRes.rows || []).map(x => x.goodsId);
		} catch (e) {}
		let insertList = data.filter(x => x.goodsId && !existing.includes(x.goodsId));
		if (insertList.length > 0) {
			await vk.baseDao.adds({ dbName, dataJson: insertList });
		}
		res.added = insertList.length;
		res.skipped = data.length - insertList.length;
		return res;
	}
}
