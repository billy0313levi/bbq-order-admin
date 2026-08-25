module.exports = {
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : 'ok' };
		let {
			goodsLogo,
			goodsLogos,
			goodsName,
			content,
			categoryId,
			start,
			salesVolume,
			delivery,
			isVip,
			rate,
			spec_list,
			sku_list
		} = data;
		let dbName = "goods";
		let defaultPrice = 0;
		if (Array.isArray(sku_list) && sku_list.length > 0) {
			let defaultSku = sku_list.find(x => x.isDefault === true) || sku_list[0];
			defaultPrice = Number(defaultSku.price) || 0;
		}
		let dataJson = {
			goodsLogo,
			goodsLogos,
			goodsName,
			content,
			categoryId,
			start: Number(start) || 1,
			salesVolume: Number(salesVolume) || 0,
			delivery: delivery === true || delivery === 1,
			isVip: isVip === true || isVip === 1,
			rate: Number(rate) || 0,
			spec_list: Array.isArray(spec_list) ? spec_list : [],
			sku_list: Array.isArray(sku_list) ? sku_list : [],
			// 字段兼容：同步写入旧字段供前台小程序使用
			name: goodsName,
			img: goodsLogo,
			imgs: goodsLogos,
			desc: content,
			category_id: categoryId,
			price: defaultPrice,
			status: (delivery === true || delivery === 1) ? 1 : 0,
			sort: 0,
			stock: 9999,
			_add_time: Date.now(),
			_add_time_str: vk.pubfn.timeFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
		};
		res.id = await vk.baseDao.add({ dbName, dataJson });
		return res;
	}
}
