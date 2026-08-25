module.exports = {
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
		let dbName = "order";
		res = await vk.baseDao.getTableData({
			dbName,
			data,
			foreignKey: [{
				name: "users",
				localField: "uid",
				foreignDbName: "uni-id-users",
				foreignField: "_id",
				fieldJson: { nickname: true, avatar: true, avatarUrl: true, mobile: true },
				as: "users"
			}],
			translationFn: (item) => {
				// 状态兼容：旧字段 status (1待接单 2制作中 3完成 4取消) -> 新 orderStatus (0待支付 1制作中 2已完成 3已取消)
				if (typeof item.orderStatus === 'undefined' && typeof item.status !== 'undefined') {
					switch (item.status) {
						case 1: item.orderStatus = 1; break; // 待接单 -> 制作中（同已支付）
						case 2: item.orderStatus = 1; break; // 制作中 -> 制作中
						case 3: item.orderStatus = 2; break; // 完成 -> 已完成
						case 4: item.orderStatus = 3; break; // 取消 -> 已取消
						default: item.orderStatus = 0;
					}
				}
				// 商品详情兼容：旧字段 goodsList -> 新 orderCartInfo
				if (Array.isArray(item.goodsList) && !Array.isArray(item.orderCartInfo)) {
					item.orderCartInfo = item.goodsList.map(g => ({
						goodsId: g.goodsId,
						goodsName: g.name,
						image: g.img,
						price: g.price,
						number: g.count,
						count: g.count,
						refund_num: 0,
						refund_amount: 0
					}));
				}
				// 桌号兼容
				if (item.tableNo && !item.tableId) {
					item.tableId = item.tableNo;
				}
				// 金额兼容
				if (typeof item.totalPrice !== 'undefined' && typeof item.totalAmount === 'undefined') {
					item.totalAmount = item.totalPrice;
					item.netReceipts = item.totalPrice;
					item.discount = 0;
					item.packingFee = 0;
					item.distributionFee = 0;
				}
				// 支付方式兼容：旧 payType 小写转大写
				if (typeof item.payType === 'string') {
					let pt = item.payType.toUpperCase();
					if (['WECHAT', 'ALIPAY', 'YUE'].includes(pt)) {
						item.payType = pt;
					} else if (item.orderStatus >= 1) {
						item.payType = 'YUE';
					}
				} else if (item.orderStatus >= 1 && !item.payType) {
					item.payType = 'YUE';
				}
				return item;
			}
		});
		return res;
	}
}
