module.exports = {
	isCloudObject: true,

	async analysis() {
		let { vk, db, _, $ } = this.getUtil();
		let res = { code: 0, msg: '' };

		let now = new Date();
		let todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
		let yesterdayStart = todayStart - 86400000;
		let sevenDaysAgo = todayStart - 7 * 86400000;

		let totalUsers = await vk.baseDao.count({ dbName: 'uni-id-users' });

		let sundayCount = await vk.baseDao.count({
			dbName: 'uni-id-users',
			whereJson: {
				register_date: _.gte(sevenDaysAgo)
			}
		});

		let yesTerDayCount = await vk.baseDao.count({
			dbName: 'uni-id-users',
			whereJson: {
				register_date: _.gte(yesterdayStart).lte(todayStart - 1)
			}
		});

		let dayAddCount = await vk.baseDao.count({
			dbName: 'uni-id-users',
			whereJson: {
				register_date: _.gte(todayStart)
			}
		});

		// 已完成订单：新 orderStatus=2 或 旧 status=3
		// 时间字段：_update_time（时间戳） 或 updateTime（serverDate）
		let todayDateObj = new Date(todayStart);
		let doneWhere = _.or([
			{ orderStatus: 2 },
			{ status: 3 }
		]);
		let timeWhere = _.or([
			{ _update_time: _.gte(todayStart) },
			{ updateTime: _.gte(todayDateObj) }
		]);
		let doneTodayWhere = _.and([doneWhere, timeWhere]);

		let dayPayCount = await vk.baseDao.count({
			dbName: 'order',
			whereJson: doneTodayWhere
		});

		// 今日已完成订单的金额总和：兼容 totalPrice 和 totalAmount/netReceipts
		// 使用 aggregate 时需要同时走两种字段结构
		let sum = 0;
		try {
			let todaySumResult = await db.collection('order').aggregate()
				.match({
					status: 3,
					updateTime: _.gte(todayDateObj)
				})
				.group({ _id: null, total: $.sum('$totalPrice') })
				.end();
			sum += (todaySumResult.data && todaySumResult.data[0]) ? (todaySumResult.data[0].total || 0) : 0;
		} catch (e) {}
		try {
			let todaySumResult2 = await db.collection('order').aggregate()
				.match({
					orderStatus: 2,
					_update_time: _.gte(todayStart)
				})
				.group({ _id: null, total: $.sum('$totalAmount') })
				.end();
			sum += (todaySumResult2.data && todaySumResult2.data[0]) ? (todaySumResult2.data[0].total || 0) : 0;
		} catch (e) {}

		let count = await vk.baseDao.count({ dbName: 'order' });

		res = {
			totalUsers: totalUsers,
			sundayCount: sundayCount,
			yesTerDayCount: yesTerDayCount,
			dayAddCount: dayAddCount,
			dayPayCount: dayPayCount,
			sum: sum,
			count: count
		};

		return res;
	},

	async test() {
		let { db, _, $ } = this.getUtil();
		let res = { code: 0, msg: '' };
		let info = [];
		let map = new Map();

		// 旧结构：goodsList.name + goodsList.count
		try {
			let result1 = await db.collection('order').aggregate()
				.match({ status: 3 })
				.unwind('$goodsList')
				.group({
					_id: '$goodsList.name',
					value: $.sum('$goodsList.count')
				})
				.end();
			(result1.data || []).forEach(item => {
				if (item._id) map.set(item._id, (map.get(item._id) || 0) + (item.value || 0));
			});
		} catch (e) {}

		// 新结构：orderCartInfo.goodsName + orderCartInfo.number
		try {
			let result2 = await db.collection('order').aggregate()
				.match({ orderStatus: 2 })
				.unwind('$orderCartInfo')
				.group({
					_id: '$orderCartInfo.goodsName',
					value: $.sum('$orderCartInfo.number')
				})
				.end();
			(result2.data || []).forEach(item => {
				if (item._id) map.set(item._id, (map.get(item._id) || 0) + (item.value || 0));
			});
		} catch (e) {}

		// 合并排序取前10
		info = Array.from(map.entries())
			.map(([name, value]) => ({ name, value }))
			.sort((a, b) => b.value - a.value)
			.slice(0, 10);

		res = { info };
		return res;
	},

	async lineChart() {
		let { vk, db, _ } = this.getUtil();
		let params = this.getParams();
		let res = { code: 0, msg: '' };
		let { time = [] } = params;

		let startDate, endDate;
		if (time && time.length === 2) {
			startDate = new Date(time[0]).getTime();
			endDate = new Date(time[1]).getTime();
		} else {
			let now = new Date();
			let yearStart = new Date(now.getFullYear(), 0, 1).getTime();
			let yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59).getTime();
			startDate = yearStart;
			endDate = yearEnd;
		}

		let diffDays = (endDate - startDate) / 86400000;
		let month = [];
		let counts = [];

		if (diffDays <= 62) {
			let cursor = new Date(startDate);
			while (cursor.getTime() <= endDate) {
				let dayStart = cursor.getTime();
				let dayEnd = dayStart + 86400000;
				let dayStartObj = new Date(dayStart);
				let dayEndObj = new Date(dayEnd - 1);
				// 兼容：_add_time（时间戳）或 createTime（serverDate）
				let whereJson = _.or([
					{ _add_time: _.gte(dayStart).lte(dayEnd) },
					{ createTime: _.gte(dayStartObj).lte(dayEndObj) }
				]);
				let countResult = await vk.baseDao.count({
					dbName: 'order',
					whereJson
				});
				month.push(`${cursor.getMonth() + 1}/${cursor.getDate()}`);
				counts.push(countResult);
				cursor.setDate(cursor.getDate() + 1);
			}
		} else {
			let cursor = new Date(startDate);
			while (cursor.getTime() <= endDate) {
				let monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getTime();
				let monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59).getTime();
				let monthStartObj = new Date(monthStart);
				let monthEndObj = new Date(monthEnd);
				let whereJson = _.or([
					{ _add_time: _.gte(monthStart).lte(monthEnd) },
					{ createTime: _.gte(monthStartObj).lte(monthEndObj) }
				]);
				let countResult = await vk.baseDao.count({
					dbName: 'order',
					whereJson
				});
				month.push(`${cursor.getFullYear()}/${cursor.getMonth() + 1}`);
				counts.push(countResult);
				cursor.setMonth(cursor.getMonth() + 1);
			}
		}

		res = { month, counts };
		return res;
	}
};