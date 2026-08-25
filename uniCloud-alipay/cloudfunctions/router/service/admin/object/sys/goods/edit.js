module.exports = {
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : 'ok' };
		let {
			_id,
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
		console.log('[goods.edit] 入参:', JSON.stringify({ _id, goodsName, price: data.price, categoryId, delivery }));
		if (vk.pubfn.isNullOne(_id)) {
			console.log('[goods.edit] 参数错误: _id为空');
			return { code : -1, msg : '参数错误: _id不能为空' };
		}
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
			isVip: isVip === true || isVip === 1,
			rate: Number(rate) || 0,
			spec_list: Array.isArray(spec_list) ? spec_list : [],
			sku_list: Array.isArray(sku_list) ? sku_list : [],
			// 字段兼容
			name: goodsName,
			img: goodsLogo,
			imgs: goodsLogos,
			desc: content,
			category_id: categoryId,
			price: defaultPrice,
			_update_time: Date.now(),
			_update_time_str: vk.pubfn.timeFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
		};
		if (typeof delivery !== 'undefined') {
			dataJson.delivery = delivery === true || delivery === 1;
			dataJson.status = (delivery === true || delivery === 1) ? 1 : 0;
		}
		console.log('[goods.edit] 待写入 dataJson:', JSON.stringify(dataJson));
		await vk.baseDao.updateById({ dbName, id: _id, dataJson });
		console.log('[goods.edit] 写入成功, _id:', _id);
		return res;
	}
}
