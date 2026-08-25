module.exports = {
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let res = { code : 0, msg : 'ok' };
		// 统一订单状态枚举：
		// orderStatus: 0待支付, 1制作中(已支付/待接单), 2已完成, 3已取消
		// 兼容旧字段 status: 1待接单, 2制作中, 3完成, 4取消
		const VALID_STATUS = [0, 1, 2, 3];
		const STATUS_MAP = {
			0: null,   // 待支付 -> 旧无对应
			1: 2,      // 制作中 -> 2制作中
			2: 3,      // 已完成 -> 3完成
			3: 4       // 已取消 -> 4取消
		};
		let { _id, orderStatus } = data;
		console.log('[order.updateOrderStatus] 入参:', JSON.stringify({ _id, orderStatus }));
		if (vk.pubfn.isNull(_id)) {
			console.log('[order.updateOrderStatus] 参数错误: _id为空');
			return { code : -1, msg : '参数错误: _id不能为空' };
		}
		orderStatus = Number(orderStatus);
		if (!VALID_STATUS.includes(orderStatus)) {
			console.log('[order.updateOrderStatus] 参数错误: 无效 orderStatus=' + orderStatus);
			return { code : -1, msg : '参数错误: 无效的订单状态' };
		}
		let dbName = "order";
		let oldStatus = STATUS_MAP[orderStatus];
		let dataJson = {
			orderStatus,
			_update_time: Date.now(),
			_update_time_str: vk.pubfn.timeFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
		};
		if (oldStatus !== null) {
			dataJson.status = oldStatus;
			dataJson.updateTime = db.serverDate();
		}
		console.log('[order.updateOrderStatus] 待写入:', JSON.stringify(dataJson));
		// 如果变为已完成或已取消，需要把桌台置为空闲
		if (orderStatus === 2 || orderStatus === 3) {
			try {
				let orderInfo = await vk.baseDao.findById({ dbName, id: _id });
				let tableNo = orderInfo.tableNo || orderInfo.tableId;
				if (tableNo) {
					await vk.baseDao.update({
						dbName: "table",
						whereJson: { tableNo },
						dataJson: {
							status: 0,
							_update_time: Date.now()
						}
					});
					console.log('[order.updateOrderStatus] 已释放桌台:', tableNo);
				}
			} catch (e) {
				console.error('[order.updateOrderStatus] 更新桌台状态失败:', e);
			}
		}
		await vk.baseDao.updateById({ dbName, id: _id, dataJson });
		console.log('[order.updateOrderStatus] 更新成功, _id:', _id);
		return res;
	}
}
