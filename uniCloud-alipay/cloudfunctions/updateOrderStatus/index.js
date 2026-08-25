'use strict';
const db = uniCloud.database();

const STATUS_OLD_TO_NEW = { 1: 1, 2: 1, 3: 2, 4: 3 };
const STATUS_NEW_TO_OLD = { 0: null, 1: 2, 2: 3, 3: 4 };

exports.main = async (event, context) => {
  const { orderId, orderNo, status } = event || {};
  let statusNum = Number(status);

  if (!orderId && !orderNo) {
    return { code: -1, data: null, msg: '参数不完整: 缺少orderId或orderNo' };
  }

  let orderStatus;
  let oldStatus;
  if ([0, 1, 2, 3].includes(statusNum)) {
    orderStatus = statusNum;
    oldStatus = STATUS_NEW_TO_OLD[statusNum];
  } else if ([1, 2, 3, 4].includes(statusNum)) {
    oldStatus = statusNum;
    orderStatus = STATUS_OLD_TO_NEW[statusNum];
  } else {
    return { code: -1, data: null, msg: '参数不完整: 无效的状态值' };
  }

  try {
    const query = orderId ? { _id: orderId } : { orderNo };
    const updateData = {
      orderStatus,
      updateTime: db.serverDate()
    };
    if (oldStatus !== null) {
      updateData.status = oldStatus;
    }
    await db.collection('order').where(query).update(updateData);

    if (orderStatus === 2 || orderStatus === 3) {
      try {
        const orders = await db.collection('order').where(query).limit(1).get();
        const order = (orders.data || [])[0];
        if (order) {
          const tableNo = order.tableNo || order.tableId;
          if (tableNo) {
            await db.collection('table')
              .where({ tableNo })
              .update({ status: 0 });
          }
        }
      } catch (e) {
        console.error('释放桌台失败:', e);
      }
    }

    return { code: 0, data: null, msg: 'ok' };
  } catch (e) {
    return {
      code: -1,
      data: null,
      msg: e.message || '更新订单状态失败'
    };
  }
};

