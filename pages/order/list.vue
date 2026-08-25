<template>
  <view>
    <view class="uni-header">
      <view class="uni-group">
        <view class="uni-title"></view>
        <view class="uni-sub-title"></view>
      </view>
      <view class="uni-group">
        <input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="搜索订单号/桌号/用户" />
        <button class="uni-button" type="default" size="mini" @click="search">搜索</button>
        <button class="uni-button" type="primary" size="mini" @click="exportExcel">导出 Excel</button>
      </view>
    </view>
    <view class="uni-container">
      <unicloud-db ref="udb" :collection="collectionList"
        field="orderNo,tableNo,tableId,goodsList,orderCartInfo,totalAmount,netReceipts,discount,remark,orderStatus,status,payType,uid,createTime,_add_time,_add_time_str"
        :where="where" page-data="replace"
        :orderby="orderby" :getcount="true" :page-size="options.pageSize" :page-current="options.pageCurrent"
        v-slot:default="{data,pagination,loading,error,options}" :options="options" loadtime="manual" @load="onqueryload">
        <uni-table ref="table" :loading="loading" :emptyText="error.message || '暂无订单'" border stripe>
          <uni-tr>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'orderNo')">订单号</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'tableNo')">桌号</uni-th>
            <uni-th align="center">商品明细</uni-th>
            <uni-th align="center">应收(元)</uni-th>
            <uni-th align="center">实收(元)</uni-th>
            <uni-th align="center">优惠(元)</uni-th>
            <uni-th align="center">支付方式</uni-th>
            <uni-th align="center" filter-type="select" :filter-data="statusOptions" @filter-change="filterChange($event, 'orderStatus')">订单状态</uni-th>
            <uni-th align="center" filter-type="timestamp" @filter-change="filterChange($event, '_add_time')">下单时间</uni-th>
            <uni-th align="center">操作</uni-th>
          </uni-tr>
          <uni-tr v-for="(item,index) in data" :key="index">
            <uni-td align="center" style="white-space:nowrap;">{{item.orderNo}}</uni-td>
            <uni-td align="center" style="white-space:nowrap;">{{item.tableNo || item.tableId}}</uni-td>
            <uni-td align="left" style="max-width:400px;">
              <view class="goods-cell">
                <view v-for="(g, gi) in getGoodsList(item)" :key="gi" class="goods-item">
                  <text class="goods-name">{{ g.name || g.goodsName }}</text>
                  <text class="goods-count">×{{ g.count || g.number }}</text>
                </view>
                <view v-if="!getGoodsList(item).length" class="goods-empty">无商品</view>
              </view>
            </uni-td>
            <uni-td align="center">{{ item.totalAmount || item.totalPrice || '0.00' }}</uni-td>
            <uni-td align="center">{{ item.netReceipts || item.totalPrice || '0.00' }}</uni-td>
            <uni-td align="center">{{ item.discount || '0.00' }}</uni-td>
            <uni-td align="center">{{ payTypeText(item.payType) }}</uni-td>
            <uni-td align="center">
              <el-tag :type="statusTagType(getOrderStatus(item))" effect="dark" size="small">
                {{ statusText(getOrderStatus(item)) }}
              </el-tag>
            </uni-td>
            <uni-td align="center" style="white-space:nowrap;">
              <uni-dateformat :threshold="[0, 0]" :date="item._add_time || item.createTime"></uni-dateformat>
            </uni-td>
            <uni-td align="center" style="white-space:nowrap;">
              <view class="btn-group">
                <button class="uni-button" size="mini" type="primary" @click="viewDetail(item)">详情</button>
                <button class="uni-button" size="mini" type="success"
                  @click="updateStatus(item, 2)">标记完成</button>
                <button class="uni-button" size="mini" type="warn"
                  @click="updateStatus(item, 3)">取消订单</button>
              </view>
            </uni-td>
          </uni-tr>
        </uni-table>
        <view class="uni-pagination-box">
          <uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current" :total="pagination.count" @change="onPageChanged" />
        </view>
      </unicloud-db>
    </view>

    <orderDetail v-model="detailVisible" @success="onDetailSuccess"></orderDetail>
  </view>
</template>

<script>
  import orderDetail from './orderDetail.vue';
  const db = uniCloud.database();

  const pageSize = 20;

  const orderByMapping = {
    "ascending": "asc",
    "descending": "desc"
  };

  export default {
    components: { orderDetail },
    data() {
      return {
        collectionList: "order",
        query: '',
        where: '',
        orderby: '',
        orderByFieldName: "",
        selectedIndexs: [],
        detailVisible: { show: false, item: null },
        statusOptions: [
          { value: 0, text: '待支付' },
          { value: 1, text: '制作中' },
          { value: 2, text: '已完成' },
          { value: 3, text: '已取消' }
        ],
        options: { pageSize },
        excelConfig: {
          filename: "order.xls",
          type: "xls",
          fields: {
            "订单号": "orderNo",
            "桌号": "tableNo",
            "应收": "totalAmount",
            "实收": "netReceipts",
            "优惠": "discount",
            "支付方式": "payType",
            "状态": "orderStatus",
            "下单时间": "_add_time_str"
          }
        },
        exportExcelData: []
      };
    },
    onLoad() {
      this._filter = {};
    },
    onReady() {
      this.$refs.udb.loadData();
    },
    methods: {
      onqueryload(data) {
        this.exportExcelData = data;
      },
      exportExcel() {
        const fields = this.excelConfig.fields;
        const data = this.exportExcelData;
        if (!data || !data.length) {
          uni.showToast({ title: '暂无数据可导出', icon: 'none' });
          return;
        }
        const headers = Object.keys(fields).map(k => fields[k]);
        const keys = Object.keys(fields);
        const statusMap = { 0: '待支付', 1: '制作中', 2: '已完成', 3: '已取消' };
        const payMap = { WECHAT: '微信', ALIPAY: '支付宝', YUE: '余额', weixin: '微信', alipay: '支付宝', yue: '余额' };
        const rows = data.map(item => {
          return keys.map(k => {
            let val = item[k];
            if (k === 'orderStatus') val = statusMap[val] || val;
            if (k === 'payType') val = payMap[val] || val;
            if (val === null || val === undefined) val = '';
            return `"${String(val).replace(/"/g, '""')}"`;
          }).join(',');
        });
        const csv = '\uFEFF' + headers.map(h => `"${h}"`).join(',') + '\n' + rows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.excelConfig.filename.replace('.xls', '.csv');
        a.click();
        URL.revokeObjectURL(url);
      },
      getOrderStatus(item) {
        if (typeof item.orderStatus !== 'undefined' && item.orderStatus !== null && item.orderStatus !== '') {
          return Number(item.orderStatus);
        }
        if (typeof item.status !== 'undefined' && item.status !== null && item.status !== '') {
          const s = Number(item.status);
          // 旧字段映射: 1=制作中(已支付), 2=制作中, 3=已完成, 4=已取消
          const map = { 1: 1, 2: 1, 3: 2, 4: 3 };
          return map[s] || 1;
        }
        return 1;
      },
      getGoodsList(item) {
        const list = item.orderCartInfo || item.goodsList;
        if (!list) return [];
        if (Array.isArray(list)) return list;
        try {
          const parsed = JSON.parse(list);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      },
      statusText(v) {
        const map = { 0: '待支付', 1: '制作中', 2: '已完成', 3: '已取消' };
        return map[v] || '未知';
      },
      statusTagType(v) {
        const map = { 0: 'danger', 1: 'warning', 2: 'success', 3: 'info' };
        return map[v] || '';
      },
      payTypeText(pt) {
        if (!pt) return '--';
        const m = { WECHAT: '微信', ALIPAY: '支付宝', YUE: '余额', weixin: '微信', alipay: '支付宝', yue: '余额' };
        return m[pt] || pt;
      },
      getWhere() {
        const query = this.query.trim();
        if (!query) return '';
        const queryRe = new RegExp(query, 'i');
        return db.command.or([
          { orderNo: queryRe },
          { tableNo: queryRe }
        ]);
      },
      search() {
        this.where = this.getWhere();
        this.$nextTick(() => this.loadData());
      },
      loadData(clear = true) {
        this.$refs.udb.loadData({ clear });
      },
      onPageChanged(e) {
        this.selectedIndexs.length = 0;
        this.$refs.table.clearSelection();
        this.$refs.udb.loadData({ current: e.current });
      },
      viewDetail(item) {
        this.detailVisible = { show: true, item };
      },
      onDetailSuccess() {
        this.loadData();
      },
      updateStatus(item, targetStatus) {
        const currentStatus = this.getOrderStatus(item);
        // 已完成或已取消的订单不允许再修改
        if (currentStatus === 2 || currentStatus === 3) {
          return;
        }
        const tip = targetStatus === 2
          ? '确认标记该订单为【已完成】？完成后桌台将自动释放。'
          : '确认【取消】该订单？桌台将自动释放。';
        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          uni.showLoading({ title: '更新中...' });
          const oldStatusMap = { 0: 1, 1: 2, 2: 3, 3: 4 };
          uniCloud.callFunction({
            name: 'router',
            data: {
              url: 'admin/object/sys.order.sys_updateOrderStatus',
              data: {
                _id: item._id,
                orderStatus: targetStatus,
                status: oldStatusMap[targetStatus]
              }
            }
          }).then(res => {
            const result = res && res.result;
            const ok = result && result.code === 0;
            if (ok) {
              uni.hideLoading();
              uni.showToast({ title: '操作成功', icon: 'success' });
              this.loadData();
              return;
            }
            const msg = (result && result.msg) || '操作失败';
            return this.updateStatusByClientDB(item._id, targetStatus, msg);
          }).catch(err => {
            const msg = (err && (err.errMsg || err.message)) || '操作失败';
            return this.updateStatusByClientDB(item._id, targetStatus, msg);
          });
        }).catch(() => {});
      },
      updateStatusByClientDB(_id, orderStatus, fallbackReason) {
        const STATUS_MAP = { 0: 1, 1: 2, 2: 3, 3: 4 };
        const oldStatus = STATUS_MAP[orderStatus];
        const data = { orderStatus };
        if (oldStatus) {
          data.status = oldStatus;
          data.updateTime = Date.now();
          data._update_time = Date.now();
        }
        let promise = db.collection('order').doc(_id).update(data);
        if (orderStatus === 2 || orderStatus === 3) {
          promise = promise.then(() => {
            return db.collection('order').doc(_id).get().then(res => {
              const info = res && res.data && res.data[0];
              const tableNo = info && (info.tableNo || info.tableId);
              if (tableNo) {
                return db.collection('table').where({ tableNo }).update({ status: 0 });
              }
            });
          });
        }
        promise.then(() => {
          uni.hideLoading();
          uni.showToast({ title: '操作成功', icon: 'success' });
          this.loadData();
        }).catch(err2 => {
          uni.hideLoading();
          const msg = (err2 && (err2.errMsg || err2.message)) || fallbackReason || '操作失败';
          uni.showModal({ title: '操作失败', content: msg, showCancel: false });
        });
      },
      sortChange(e, name) {
        this.orderByFieldName = name;
        this.orderby = e.order ? name + ' ' + orderByMapping[e.order] : '';
        this.$refs.table.clearSelection();
        this.$nextTick(() => this.$refs.udb.loadData());
      },
      filterChange(e, name) {
        this._filter[name] = { type: e.filterType, value: e.filter };
        const { filterToWhere } = require('../../js_sdk/validator/order.js');
        const newWhere = filterToWhere(this._filter, db.command);
        this.where = Object.keys(newWhere).length ? newWhere : '';
        this.$nextTick(() => this.$refs.udb.loadData());
      }
    }
  };
</script>

<style lang="scss" scoped>
.goods-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.goods-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 8px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
}
.goods-name {
  color: #303133;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}
.goods-count {
  color: #909399;
  margin-left: 8px;
  font-weight: bold;
}
.goods-empty {
  color: #c0c4cc;
  font-size: 12px;
}
.btn-group {
  display: flex;
  gap: 6px;
  flex-wrap: nowrap;
  justify-content: center;
}
</style>
