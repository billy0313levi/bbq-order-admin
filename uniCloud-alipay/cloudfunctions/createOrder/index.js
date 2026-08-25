'use strict';
const db = uniCloud.database();

function buildOrderNo() {
  const now = new Date();
  const pad = (n, len) => String(n).padStart(len, '0');
  const ts = `${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}`;
  const rand = pad(Math.floor(Math.random() * 10000), 4);
  return `TX${ts}${rand}`;
}

exports.main = async (event, context) => {
  const { tableId, goodsList, totalPrice, remark, uid, payType } = event || {};

  if (!tableId || !Array.isArray(goodsList) || goodsList.length === 0) {
    return {
      code: -1,
      data: null,
      msg: '参数不完整'
    };
  }

  try {
    const orderNo = buildOrderNo();
    const now = Date.now();
    const orderData = {
      orderNo,
      tableNo: tableId,
      tableId: tableId,
      goodsList,
      orderCartInfo: goodsList.map(g => ({
        goodsId: g.goodsId,
        goodsName: g.name,
        image: g.img,
        price: g.price,
        number: g.count,
        count: g.count,
        refund_num: 0,
        refund_amount: 0
      })),
      totalPrice: Number(totalPrice) || 0,
      totalAmount: Number(totalPrice) || 0,
      netReceipts: Number(totalPrice) || 0,
      discount: 0,
      packingFee: 0,
      distributionFee: 0,
      remark: remark || '',
      // 用户付款后直接进入制作中状态
      status: 2,            // 旧字段：2制作中
      orderStatus: 1,       // 新字段：1制作中(已支付)
      payType: payType || 'YUE',
      uid: uid || '',
      createTime: db.serverDate(),
      updateTime: db.serverDate(),
      _add_time: now,
      _add_time_str: new Date(now).toLocaleString()
    };

    const res = await db.collection('order').add(orderData);

    await db.collection('table')
      .where({ tableNo: tableId })
      .update({ status: 1 });

    return {
      code: 0,
      data: {
        orderId: res.id,
        orderNo
      },
      msg: 'ok'
    };
  } catch (e) {
    return {
      code: -1,
      data: null,
      msg: e.message || '创建订单失败'
    };
  }
};

