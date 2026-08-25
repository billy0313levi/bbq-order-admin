module.exports = {
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : 'ok' };
		let { _id } = data;
		if (vk.pubfn.isNull(_id)) {
			return { code : -1, msg : 'id不能为空' };
		}
		let dbName = "category";
		await vk.baseDao.deleteById({ dbName, id: _id });
		return res;
	}
}
