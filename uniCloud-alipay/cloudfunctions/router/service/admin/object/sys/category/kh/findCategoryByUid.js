module.exports = {
	main: async (event) => {
		let { data = {}, util } = event;
		let { vk , db, _ } = util;
		let res = { code : 0, msg : '' };
		let dbName = "category";
		let whereJson = {};
		// 字段兼容：只返回启用的分类
		let orConds = [];
		orConds.push({ delivery: true });
		orConds.push({ status: 1 });
		whereJson = _.or(orConds);
		let list = await vk.baseDao.selects({
			dbName,
			fieldJson: { _id: true, name: true, icon: true, categoryName: true, categoryLogo: true, sort: true },
			whereJson: {},
			sortArr: [{ name: "sort", type: "asc" }]
		});
		res.rows = (list.rows || []).map(item => {
			if (item.name && !item.categoryName) item.categoryName = item.name;
			if (item.icon && !item.categoryLogo) item.categoryLogo = item.icon;
			return item;
		});
		return res;
	}
}
