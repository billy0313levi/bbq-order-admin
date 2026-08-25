module.exports = {
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
		let dbName = "goods";
		res = await vk.baseDao.getTableData({
			dbName,
			data,
			foreignKey: [{
				name: "category",
				localField: "categoryId",
				foreignDbName: "category",
				foreignField: "_id",
				fieldJson: { categoryName: true, name: true },
				as: "category"
			}],
			translationFn: (item) => {
				if (item.name && !item.goodsName) item.goodsName = item.name;
				if (item.img && !item.goodsLogo) item.goodsLogo = item.img;
				if (item.category_id && !item.categoryId) item.categoryId = item.category_id;
				if (typeof item.status !== 'undefined' && typeof item.delivery === 'undefined') {
					item.delivery = (item.status === 1);
				}
				if (typeof item.price !== 'undefined' && vk.pubfn.isNotNull(item.price) && (!item.sku_list || item.sku_list.length === 0)) {
					item.sku_list = [{
						sku_name: "默认规格",
						price: item.price,
						vipPrice: item.price,
						isDefault: true
					}];
				}
				return item;
			}
		});
		return res;
	}
}
