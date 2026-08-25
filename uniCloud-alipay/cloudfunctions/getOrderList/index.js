'use strict';
const db = uniCloud.database();

function toTs(value) {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  const d = new Date(String(value).replace(/-/g, '/'));
  if (isNaN(d.getTime())) return 0;
  return d.getTime();
}

const STATUS_OLD_TO_NEW = { 1: 1, 2: 1, 3: 2, 4: 3 };

exports.main = async (event, context) => {
  const status = Number((event && event.status) ?? '');
  try {
    const query = {};
    if ([0, 1, 2, 3].includes(status)) {
      query.orderStatus = status;
    } else if ([1, 2, 3, 4].includes(status)) {
      query.status = status;
    }
    const res = await db.collection('order')
      .where(query)
      .limit(50)
      .get();
    const list = (res.data || []).map(item => {
      if (typeof item.orderStatus === 'undefined' && typeof item.status !== 'undefined') {
        item.orderStatus = STATUS_OLD_TO_NEW[item.status] || 0;
      }
      if (typeof item.status === 'undefined' && typeof item.orderStatus !== 'undefined') {
        const map = { 0: 1, 1: 2, 2: 3, 3: 4 };
        item.status = map[item.orderStatus] || 1;
      }
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
      if (typeof item.totalPrice !== 'undefined' && typeof item.totalAmount === 'undefined') {
        item.totalAmount = item.totalPrice;
        item.netReceipts = item.totalPrice;
        item.discount = 0;
        item.packingFee = 0;
        item.distributionFee = 0;
      }
      if (typeof item.payType === 'string') {
        const pt = item.payType.toUpperCase();
        if (['WECHAT', 'ALIPAY', 'YUE'].includes(pt)) item.payType = pt;
      } else if (item.orderStatus >= 1 && !item.payType) {
        item.payType = 'YUE';
      }
      return item;
    }).sort((a, b) => toTs(b.createTime || b._add_time) - toTs(a.createTime || a._add_time));
    return {
      code: 0,
      data: list,
      msg: 'ok'
    };
  } catch (e) {
    return {
      code: -1,
      data: null,
      msg: e.message || '查询订单失败'
    };
  }
};

