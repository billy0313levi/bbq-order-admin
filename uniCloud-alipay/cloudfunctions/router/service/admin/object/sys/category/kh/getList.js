module.exports = {
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
		let dbName = "category";
		res = await vk.baseDao.getTableData({
			dbName,
			data,
			// 字段兼容：将旧字段name/icon/status映射为新字段categoryName/categoryLogo/delivery
			translationFn: (item) => {
				if (item.name && !item.categoryName) item.categoryName = item.name;
				if (item.icon && !item.categoryLogo) item.categoryLogo = item.icon;
				if (typeof item.status !== 'undefined' && typeof item.delivery === 'undefined') {
					item.delivery = (item.status === 1);
				}
				return item;
			}
		});
		return res;
	}
}
