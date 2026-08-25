<template>
  <view>
    <view class="uni-header">
      <view class="uni-group">
        <view class="uni-title">分类管理</view>
      </view>
      <view class="uni-group">
        <button class="uni-button" type="primary" size="mini" @click="addCategory">新增分类</button>
      </view>
    </view>
    <view class="uni-container">
      <el-table :data="tableData" v-loading="loading" border stripe style="width: 100%;">
        <el-table-column label="分类名称" prop="categoryName" align="center">
          <template slot-scope="scope">
            {{ scope.row.categoryName || scope.row.name || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" width="150">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.sort"
              :min="0"
              :max="999"
              size="mini"
              controls-position="right"
              style="width: 100%;"
              @change="(val) => updateSort(scope.row, val)">
            </el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="120">
          <template slot-scope="scope">
            <el-tag v-if="isEnabled(scope.row)" type="success" size="small">已启用</el-tag>
            <el-tag v-else type="info" size="small">已禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editCategory(scope.row)">编辑</el-button>
            <el-button v-if="isEnabled(scope.row)" type="text" size="small" style="color:#e6a23c;" @click="toggleEnable(scope.row, false)">禁用</el-button>
            <el-button v-else type="text" size="small" style="color:#67c23a;" @click="toggleEnable(scope.row, true)">启用</el-button>
            <el-button type="text" size="small" style="color:#f56c6c;" @click="confirmDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </view>
  </view>
</template>

<script>
const db = uniCloud.database();

export default {
  data() {
    return {
      loading: false,
      tableData: []
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    isEnabled(row) {
      if (row.delivery !== undefined && row.delivery !== null) {
        return row.delivery === true || row.delivery === 1;
      }
      if (row.status !== undefined && row.status !== null) {
        return Number(row.status) === 1;
      }
      return false;
    },
    loadData() {
      this.loading = true;
      db.collection('category')
        .orderBy('sort', 'asc')
        .limit(500)
        .get()
        .then(res => {
          this.tableData = res.result.data || [];
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.tableData = [];
        });
    },
    addCategory() {
      uni.navigateTo({ url: '/pages/category/add' });
    },
    editCategory(row) {
      uni.navigateTo({ url: '/pages/category/edit?id=' + row._id });
    },
    updateSort(row, val) {
      db.collection('category').doc(row._id).update({
        sort: val
      }).then(() => {
        uni.showToast({ title: '排序已更新', icon: 'success', duration: 1000 });
      }).catch(() => {
        uni.showToast({ title: '排序更新失败', icon: 'none' });
        this.loadData();
      });
    },
    toggleEnable(row, targetVal) {
      const newDelivery = targetVal;
      const newStatus = targetVal ? 1 : 0;
      
      // 先乐观更新本地状态
      this.$set(row, 'delivery', newDelivery);
      this.$set(row, 'status', newStatus);
      
      uniCloud.callFunction({
        name: 'router',
        data: {
          url: 'admin/object/sys.category.sys_updateIsOnSale',
          data: {
            ids: [row._id],
            delivery: newDelivery
          }
        }
      }).then(res => {
        const result = res && res.result;
        const ok = result && result.code === 0;
        if (ok) {
          uni.showToast({ title: newDelivery ? '已启用' : '已禁用', icon: 'success' });
        } else {
          // 业务失败时降级直接更新数据库
          db.collection('category').doc(row._id).update({
            delivery: newDelivery,
            status: newStatus
          }).then(() => {
            uni.showToast({ title: newDelivery ? '已启用' : '已禁用', icon: 'success' });
          }).catch(() => {
            this.$set(row, 'delivery', !newDelivery);
            this.$set(row, 'status', newDelivery ? 0 : 1);
            const msg = (result && result.msg) || '操作失败';
            uni.showModal({ title: '操作失败', content: msg, showCancel: false });
          });
        }
      }).catch(err => {
        // 接口异常时直接更新数据库
        db.collection('category').doc(row._id).update({
          delivery: newDelivery,
          status: newStatus
        }).then(() => {
          uni.showToast({ title: newDelivery ? '已启用' : '已禁用', icon: 'success' });
        }).catch(() => {
          this.$set(row, 'delivery', !newDelivery);
          this.$set(row, 'status', newDelivery ? 0 : 1);
          const msg = (err && (err.errMsg || err.message)) || '操作失败';
          uni.showModal({ title: '操作失败', content: msg, showCancel: false });
        });
      });
    },
    confirmDelete(row) {
      this.$confirm(`确认删除分类【${row.categoryName || row.name}】？删除后不可恢复。`, '提示', {
        type: 'warning'
      }).then(() => {
        db.collection('category').doc(row._id).remove().then(() => {
          uni.showToast({ title: '删除成功', icon: 'success' });
          this.loadData();
        }).catch(() => {
          uni.showToast({ title: '删除失败', icon: 'none' });
        });
      }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
