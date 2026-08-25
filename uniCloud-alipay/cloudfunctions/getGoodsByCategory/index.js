'use strict';
const db = uniCloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const categoryId = (event && event.categoryId) || '';
  try {
    async function queryGoods(whereJson) {
      const res = await db.collection('goods')
        .where(whereJson)
        .orderBy('sort', 'asc')
        .get();
      const list = (res.data || []).map(item => {
        if (item.goodsName && !item.name) item.name = item.goodsName;
        if (item.goodsLogo && !item.img) item.img = item.goodsLogo;
        if (item.categoryId && !item.category_id) item.category_id = item.categoryId;
        if (typeof item.price === 'undefined' && Array.isArray(item.sku_list) && item.sku_list.length > 0) {
          const sku = item.sku_list.find(x => x.isDefault === true) || item.sku_list[0];
          item.price = Number(sku.price) || 0;
        }
        return item;
      });
      return { code: 0, data: list, msg: 'ok' };
    }

    const baseWhere = _.or([{ status: 1 }, { delivery: true }]);
    if (categoryId && categoryId !== 'cat_rec') {
      const catWhere = _.or([
        { category_id: categoryId },
        { categoryId: categoryId }
      ]);
      return queryGoods(_.and([baseWhere, catWhere]));
    }
    return queryGoods(baseWhere);
  } catch (e) {
    return {
      code: -1,
      data: null,
      msg: e.message || '查询菜品失败'
    };
  }
};


