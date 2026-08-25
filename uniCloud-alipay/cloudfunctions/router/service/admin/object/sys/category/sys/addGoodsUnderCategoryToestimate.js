module.exports = {
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let res = { code : 0, msg : 'ok' };
		let { _id } = data;
		if (vk.pubfn.isNull(_id)) {
			return { code : -1, msg : '参数错误: _id不能为空' };
		}
		let dbName = "category";
		let category = await vk.baseDao.findById({ dbName, id: _id });
		if (!category) {
			return { code : -1, msg : '分类不存在' };
		}
		// 查询该分类下的商品
		let goodsRes = await vk.baseDao.selects({
			dbName: "goods",
			whereJson: { categoryId: _id },
			limit: 1000
		});
		let goodsList = goodsRes.rows || [];
		if (goodsList.length === 0) {
			return { code : 0, msg : '该分类下没有商品', data: [] };
		}
		// 批量插入估清
		let estimateDbName = "estimate";
		let addList = goodsList.map(g => ({
			goodsId: g._id,
			uid: g.uid || userInfo && userInfo._id,
			goodsName: g.goodsName || g.name,
			categoryName: category.categoryName || category.name,
			categoryId: _id,
			logo: g.goodsLogo || g.img,
			_add_time: Date.now(),
			_add_time_str: vk.pubfn.timeFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
		}));
		let result = await vk.baseDao.adds({ dbName: estimateDbName, dataJson: addList });
		return { code : 0, msg : '添加成功', data: result };
	}
}
