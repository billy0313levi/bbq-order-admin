'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  const res = { code: 0, msg: 'ok' };
  try {
    const goodsRes = await db.collection('goods').limit(1000).get();
    res.goodsCount = goodsRes.data.length;
    res.goods = goodsRes.data.map(g => ({
      _id: g._id,
      goodsName: g.goodsName,
      name: g.name,
      categoryId: g.categoryId,
      category_id: g.category_id,
      uid: g.uid,
      price: g.price,
      delivery: g.delivery,
      status: g.status,
      sort: g.sort,
      isVip: g.isVip,
      _add_time_str: g._add_time_str,
      _add_time: g._add_time,
      skuCount: Array.isArray(g.sku_list) ? g.sku_list.length : 0,
      sku_prices: Array.isArray(g.sku_list) ? g.sku_list.map(s => s.price) : [],
      hasImg: !!(g.goodsLogo || g.img),
      img: (g.goodsLogo || g.img || '').substring(0, 60)
    }));

    const catRes = await db.collection('category').limit(1000).get();
    res.categoryCount = catRes.data.length;
    res.categories = catRes.data.map(c => ({
      _id: c._id,
      categoryName: c.categoryName,
      name: c.name,
      uid: c.uid,
      _add_time_str: c._add_time_str
    }));
  } catch (e) {
    res.code = -1;
    res.msg = e.message || '查询失败';
  }
  return res;
};
