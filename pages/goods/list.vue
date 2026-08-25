<template>
  <view>
    <view class="uni-header">
      <view class="uni-group">
        <view class="uni-title">菜品管理</view>
      </view>
      <view class="uni-group">
        <input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="搜索菜品名称" />
        <el-select v-model="filterCategory" placeholder="全部分类" clearable size="small" style="width:160px;margin:0 8px;" @change="search">
          <el-option v-for="cat in categoryList" :key="cat._id" :label="cat.categoryName || cat.name" :value="cat._id"></el-option>
        </el-select>
        <button class="uni-button" type="default" size="mini" @click="search">搜索</button>
        <button class="uni-button" type="primary" size="mini" @click="openForm('add')">新增菜品</button>
        <button class="uni-button" type="default" size="mini" @click="goCategoryManage">分类管理</button>
      </view>
    </view>
    <view class="uni-container">
      <el-table :data="tableData" v-loading="loading" border stripe style="width: 100%;">
        <el-table-column label="图片" width="100" align="center">
          <template slot-scope="scope">
            <el-image v-if="getImg(scope.row)" :src="getImg(scope.row)"
              style="width: 60px; height: 60px; border-radius: 6px;"
              :preview-src-list="[getImg(scope.row)]"
              fit="cover"></el-image>
            <text v-else style="color:#ccc;">无图</text>
          </template>
        </el-table-column>
        <el-table-column label="菜品名称" prop="goodsName" align="center" width="160">
          <template slot-scope="scope">
            {{ scope.row.goodsName || scope.row.name || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center" width="120">
          <template slot-scope="scope">
            <text>{{ getCategoryName(scope.row) }}</text>
          </template>
        </el-table-column>
        <el-table-column label="价格(元)" align="center" width="120">
          <template slot-scope="scope">
            <text style="color:#ff6b35;font-weight:bold;">¥{{ getPrice(scope.row) }}</text>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.content || scope.row.desc || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="上架状态" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="isOnSale(scope.row)" type="success" size="small">上架中</el-tag>
            <el-tag v-else type="info" size="small">已下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openForm('edit', scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="toggleSale(scope.row)">
              {{ isOnSale(scope.row) ? '下架' : '上架' }}
            </el-button>
            <el-button type="text" size="small" style="color:#f56c6c;" @click="confirmDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </view>

    <!-- 编辑弹窗 -->
    <el-dialog :title="formTitle" :visible.sync="formVisible" width="600px" :close-on-click-modal="true">
      <el-form :model="formData" :rules="formRules" ref="goodsForm" label-width="100px">
        <el-form-item label="菜品图片" prop="goodsLogo">
          <view class="upload-area">
            <el-upload
              class="goods-uploader"
              action=""
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleFileChange"
              accept="image/*">
              <el-image v-if="formData.goodsLogo" :src="formData.goodsLogo"
                style="width: 100px; height: 100px; border-radius: 6px;"
                :preview-src-list="[formData.goodsLogo]" fit="cover"></el-image>
              <el-button v-if="!formData.goodsLogo" type="primary" size="small" icon="el-icon-upload2">点击上传</el-button>
              <el-button v-else type="text" size="small">更换图片</el-button>
            </el-upload>
            <el-button v-if="formData.goodsLogo" type="text" size="small" style="color:#f56c6c;" @click="removeImage">移除</el-button>
          </view>
        </el-form-item>
        <el-form-item label="菜品名称" prop="goodsName">
          <el-input v-model="formData.goodsName" placeholder="请输入菜品名称"></el-input>
        </el-form-item>
        <el-form-item label="菜品分类" prop="categoryId">
          <el-select v-model="formData.categoryId" placeholder="请选择分类" style="width:100%;">
            <el-option v-for="cat in categoryList" :key="cat._id" :label="cat.categoryName || cat.name" :value="cat._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="售价(元)" prop="price">
          <el-input-number v-model="formData.price" :min="0" :precision="2" :step="0.5" @change="onPriceChange"></el-input-number>
        </el-form-item>
        <el-form-item label="菜品描述" prop="content">
          <el-input v-model="formData.content" type="textarea" :rows="3" placeholder="请输入菜品描述"></el-input>
        </el-form-item>
        <el-form-item label="是否上架" prop="delivery">
          <el-switch v-model="formData.delivery" :active-value="true" :inactive-value="false"></el-switch>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 隐藏的文件选择器已移除，使用 el-upload 原生实现 -->
  </view>
</template>

<script>
const db = uniCloud.database();

export default {
  data() {
    return {
      loading: false,
      submitting: false,
      query: '',
      filterCategory: '',
      where: '',
      tableData: [],
      categoryList: [],
      formVisible: false,
      formMode: 'add',
      formData: {
        goodsLogo: '',
        goodsName: '',
        categoryId: '',
        price: 0,
        content: '',
        delivery: true,
        sort: 0,
        img: ''
      },
      formRules: {
        goodsName: [{ required: true, message: '请输入菜品名称', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
      }
    };
  },
  computed: {
    formTitle() {
      return this.formMode === 'add' ? '新增菜品' : '编辑菜品';
    }
  },
  onLoad() {
    // 先加载分类数据，再加载商品数据，确保分类名能正确显示
    this.loadCategories().then(() => {
      this.loadData();
    });
  },
  methods: {
    getImg(row) {
      return row.goodsLogo || row.img || row.image || '';
    },
    getPrice(row) {
      if (row.sku_list && row.sku_list.length) {
        const def = row.sku_list.find(s => s.isDefault);
        return def ? def.price : row.sku_list[0].price;
      }
      return row.price || 0;
    },
    isOnSale(row) {
      // 优先使用稳定的响应式字段 saleStatus
      if (row.saleStatus !== undefined && row.saleStatus !== null) return row.saleStatus;
      if (row._sale !== undefined) return row._sale;
      if (typeof row.delivery !== 'undefined') return row.delivery === true || row.delivery === 1;
      if (typeof row.status !== 'undefined') return Number(row.status) === 1;
      return false;
    },
    getCategoryName(row) {
      const cid = String(row.categoryId || row.category_id || row.cat_id || '').trim();
      if (!cid) return '--';
      
      // 优先从已加载的 categoryList 中查找
      const list = this.categoryList || [];
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const itemId = String(item._id || item.id || '').trim();
        const itemName = String(item.name || '').trim();
        const itemCategoryName = String(item.categoryName || '').trim();
        
        // 尝试多种匹配方式：_id, name, categoryName
        if (itemId === cid || itemName === cid || itemCategoryName === cid) {
          // 优先返回中文分类名 (categoryName)，其次是 name
          return itemCategoryName || itemName || itemId || cid;
        }
      }
      
      // 如果 categoryList 还没加载完，或者找不到匹配，返回原始值
      return cid;
    },
    convertCloudImages(list) {
      // 将 cloud:// 格式的 fileID 转换成浏览器可访问的 https 地址
      const fileIDs = list
        .map(item => item.goodsLogo || item.img || '')
        .filter(id => id && id.indexOf('cloud://') === 0);
      if (fileIDs.length === 0) return Promise.resolve();
      return uniCloud.getTempFileURL({ fileList: fileIDs }).then(res => {
        const urlMap = {};
        (res.fileList || []).forEach(item => {
          urlMap[item.fileID] = item.tempFileURL;
        });
        list.forEach(item => {
          const key = item.goodsLogo || item.img || '';
          if (key && urlMap[key]) {
            item.goodsLogo = urlMap[key];
            item.img = urlMap[key];
          }
        });
      }).catch(() => {});
    },
    loadCategories() {
      // 返回 Promise，确保调用者可以等待分类加载完成
      return new Promise((resolve) => {
        this.categoryList = [];
        
        // 先尝试通过接口加载
        uniCloud.callFunction({
          name: 'router',
          data: { url: 'admin/object/sys.category.kh_getList', data: {} }
        }).then(res => {
          const rows = (res.result && res.result.data && res.result.data.rows) || [];
          if (rows.length > 0) {
            this.categoryList = rows;
            resolve();
          } else {
            // 接口返回空数据时，降级直接查数据库
            return db.collection('category').limit(500).get().then(catRes => {
              this.categoryList = (catRes.result && catRes.result.data) || [];
              resolve();
            }).catch(() => resolve());
          }
        }).catch(() => {
          // 接口失败时降级直接查数据库
          db.collection('category').limit(500).get().then(catRes => {
            this.categoryList = (catRes.result && catRes.result.data) || [];
            resolve();
          }).catch(() => resolve());
        });
      });
    },
    loadData() {
      this.loading = true;
      const dbOrderBy = 'sort asc, _add_time desc';
      const dbSearchFields = ['goodsName', 'name'];
      let where = {};
      if (this.query.trim()) {
        const q = this.query.trim();
        where = db.command.or([
          { goodsName: new RegExp(q, 'i') },
          { name: new RegExp(q, 'i') }
        ]);
      }
      if (this.filterCategory) {
        where.categoryId = this.filterCategory;
      }
      db.collection('goods')
        .where(where)
        .orderBy(dbOrderBy)
        .limit(1000)
        .get()
        .then(res => {
          const rawData = res.result.data || [];
          return this.convertCloudImages(rawData).then(() => rawData);
        })
        .then(rawData => {
          // 为每条数据初始化响应式状态字段 saleStatus
          this.tableData = rawData.map(item => {
            let initStatus = false;
            if (item.delivery !== undefined) initStatus = item.delivery === true || item.delivery === 1;
            else if (item.status !== undefined) initStatus = Number(item.status) === 1;
            
            // 使用 $set 确保 saleStatus 是响应式的
            if (item.saleStatus === undefined) {
              this.$set(item, 'saleStatus', initStatus);
            }
            return item;
          });
          
          console.log('[菜品列表] 数据条数:', this.tableData.length);
          if (this.tableData.length > 0) {
            console.log('[菜品列表] 第一条数据分类字段:', {
              categoryId: this.tableData[0].categoryId,
              category_id: this.tableData[0].category_id,
              category: this.tableData[0].category,
              saleStatus: this.tableData[0].saleStatus
            });
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.tableData = [];
        });
    },
    goCategoryManage() {
      uni.navigateTo({ url: '/pages/category/category' });
    },
    search() {
      this.loadData();
    },
    openForm(mode, row) {
      this.formMode = mode;
      if (mode === 'edit' && row) {
        this.formData = {
          _id: row._id,
          goodsLogo: row.goodsLogo || row.img || '',
          goodsName: row.goodsName || row.name || '',
          categoryId: row.categoryId || row.category_id || '',
          price: this.getPrice(row),
          content: row.content || row.desc || '',
          delivery: this.isOnSale(row),
          sort: row.sort || 0,
          img: row.img || ''
        };
      } else {
        this.formData = {
          goodsLogo: '',
          goodsName: '',
          categoryId: '',
          price: 0,
          content: '',
          delivery: true,
          sort: 0,
          img: ''
        };
      }
      this.formVisible = true;
      this.$nextTick(() => {
        if (this.$refs.goodsForm) this.$refs.goodsForm.clearValidate();
      });
    },
    uploadImage() {
      this.$refs.fileInput && this.$refs.fileInput.click();
    },
    async handleFileChange(file) {
      if (!file || !file.raw) return;
      uni.showLoading({ title: '上传中...', mask: true });
      try {
        // 用 Promise 包装 FileReader，读取为 base64
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => reject(reader.error || new Error('无法读取图片文件'));
          reader.readAsDataURL(file.raw);
        });
        const cloudPath = `goods/${Date.now()}_${file.name}`;
        const res = await uniCloud.callFunction({
          name: 'uploadImage',
          data: { cloudPath, dataUrl }
        });
        const result = res && res.result;
        if (result && result.code === 0) {
          // 优先使用云函数返回的真实 https 地址（getTempFileURL 返回字段为 tempFileURL）
          let url = result.url || result.fileID || '';
          // 兜底：若仍是 cloud:// 格式，再尝试转换一次
          if (url.indexOf('cloud://') === 0) {
            const tmp = await uniCloud.getTempFileURL({ fileList: [url] });
            const t = tmp.fileList && tmp.fileList[0];
            if (t && t.tempFileURL) url = t.tempFileURL;
          }
          this.formData.goodsLogo = url;
          this.formData.img = url;
          uni.hideLoading();
          uni.showToast({ title: '上传成功', icon: 'success' });
        } else {
          uni.hideLoading();
          const msg = (result && result.msg) || '上传失败';
          uni.showModal({ title: '上传失败', content: msg, showCancel: false });
        }
      } catch (err) {
        uni.hideLoading();
        const msg = (err && (err.errMsg || err.message)) || '上传失败';
        uni.showModal({ title: '上传失败', content: msg, showCancel: false });
      }
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      uni.showLoading({ title: '上传中...', mask: true });
      const cloudPath = `goods/${Date.now()}_${file.name}`;
      uniCloud.uploadFile({
        filePath: file,
        cloudPath: cloudPath
      }).then(res => {
        const url = res.fileID || res.url;
        this.formData.goodsLogo = url;
        this.formData.img = url;
        uni.hideLoading();
        uni.showToast({ title: '上传成功', icon: 'success' });
      }).catch(err => {
        uni.hideLoading();
        const msg = (err && (err.errMsg || err.message)) || '上传失败';
        uni.showModal({ title: '上传失败', content: msg, showCancel: false });
      });
      e.target.value = '';
    },
    removeImage() {
      this.$confirm('确认移除图片？', '提示', { type: 'warning' }).then(() => {
        this.formData.goodsLogo = '';
        this.formData.img = '';
      }).catch(() => {});
    },
    onPriceChange(val) {
      this.formData.price = val;
    },
    submitForm() {
      this.$refs.goodsForm.validate(valid => {
        if (!valid) return;
        this.submitting = true;
        const action = this.formMode === 'add'
          ? 'admin/object/sys.goods.add'
          : 'admin/object/sys.goods.edit';
        const data = {
          goodsLogo: this.formData.goodsLogo,
          goodsName: this.formData.goodsName,
          categoryId: this.formData.categoryId,
          price: this.formData.price,
          content: this.formData.content,
          delivery: this.formData.delivery,
          sort: this.formData.sort,
          img: this.formData.goodsLogo,
          name: this.formData.goodsName,
          desc: this.formData.content
        };
        if (this.formMode === 'edit') data._id = this.formData._id;
        uniCloud.callFunction({
          name: 'router',
          data: { url: action, data }
        }).then(res => {
          const result = res && res.result;
          const ok = result && result.code === 0;
          if (ok) {
            this.submitting = false;
            this.formVisible = false;
            uni.showToast({ title: '保存成功', icon: 'success' });
            this.loadData();
            return;
          }
          const msg = (result && result.msg) || '保存失败';
          return this.saveGoodsByClientDB(action, data, msg);
        }).catch(err => {
          const msg = (err && (err.errMsg || err.message)) || '保存失败';
          return this.saveGoodsByClientDB(action, data, msg);
        });
      });
    },
    saveGoodsByClientDB(action, data, fallbackReason) {
      const delivery = typeof data.delivery !== 'undefined' ? (data.delivery === true || data.delivery === 1) : true;
      const baseData = {
        goodsLogo: data.goodsLogo,
        goodsLogos: data.goodsLogos || [],
        goodsName: data.goodsName,
        content: data.content,
        categoryId: data.categoryId,
        delivery,
        // 兼容字段
        name: data.goodsName,
        img: data.goodsLogo,
        imgs: data.goodsLogos || [],
        desc: data.content,
        category_id: data.categoryId,
        status: delivery ? 1 : 0,
        price: Number(data.price) || 0,
        sort: Number(data.sort) || 0,
        salesVolume: Number(data.salesVolume) || 0,
        isVip: data.isVip === true || data.isVip === 1,
        rate: Number(data.rate) || 0,
        spec_list: Array.isArray(data.spec_list) ? data.spec_list : [],
        sku_list: Array.isArray(data.sku_list) ? data.sku_list : [],
        start: Number(data.start) || 1
      };
      const col = db.collection('goods');
      let promise;
      if (action.indexOf('edit') >= 0 && data._id) {
        promise = col.doc(data._id).update(baseData);
      } else {
        promise = col.add({ ...baseData, createTime: Date.now() });
      }
      promise.then(() => {
        this.submitting = false;
        this.formVisible = false;
        uni.showToast({ title: '保存成功', icon: 'success' });
        this.loadData();
      }).catch(err2 => {
        this.submitting = false;
        const msg = (err2 && (err2.errMsg || err2.message)) || fallbackReason || '保存失败';
        uni.showModal({ title: '保存失败', content: msg, showCancel: false });
      });
    },
    toggleSale(row) {
      // 使用响应式字段 saleStatus 进行切换
      const newVal = !row.saleStatus;
      
      // 乐观更新：使用 $set 确保响应式，不再需要 $forceUpdate
      this.$set(row, 'saleStatus', newVal);
      this.$set(row, 'delivery', newVal);
      this.$set(row, 'status', newVal ? 1 : 0);
      
      const data = {
        ids: [row._id],
        delivery: newVal,
        status: newVal ? 1 : 0
      };
      
      // 优先调用专用接口
      uniCloud.callFunction({
        name: 'router',
        data: { url: 'admin/object/sys.goods.sys_updateIsOnSale', data }
      }).then(res => {
        const code = res && res.result && res.result.code;
        if (code !== 0) {
          return db.collection('goods').doc(row._id).update({
            delivery: newVal,
            status: newVal ? 1 : 0
          });
        }
      }).catch(() => {
        // 接口不存在或异常时，降级直接更新数据库
        return db.collection('goods').doc(row._id).update({
          delivery: newVal,
          status: newVal ? 1 : 0
        });
      }).then(() => {
        // 成功：状态已是乐观更新后的值，只需提示
        uni.showToast({ title: newVal ? '已上架' : '已下架', icon: 'success' });
      }).catch((err) => {
        // 全部失败：回滚状态
        const oldVal = !newVal;
        this.$set(row, 'saleStatus', oldVal);
        this.$set(row, 'delivery', oldVal);
        this.$set(row, 'status', oldVal ? 1 : 0);
        const msg = (err && (err.errMsg || err.message)) || '操作失败';
        uni.showModal({ title: '操作失败', content: msg, showCancel: false });
      });
    },
    confirmDelete(row) {
      this.$confirm(`确认删除菜品【${row.goodsName || row.name}】？删除后不可恢复。`, '提示', {
        type: 'warning'
      }).then(() => {
        uniCloud.callFunction({
          name: 'router',
          data: {
            url: 'admin/object/sys.goods.del',
            data: { _id: row._id }
          }
        }).then(res => {
          const result = res && res.result;
          const ok = result && result.code === 0;
          if (ok) {
            uni.showToast({ title: '删除成功', icon: 'success' });
            this.loadData();
            return;
          }
          const msg = (result && result.msg) || '删除失败';
          return this.deleteGoodsByClientDB(row._id, msg);
        }).catch(err => {
          const msg = (err && (err.errMsg || err.message)) || '删除失败';
          return this.deleteGoodsByClientDB(row._id, msg);
        });
      }).catch(() => {});
    },
    deleteGoodsByClientDB(_id, fallbackReason) {
      db.collection('goods').doc(_id).remove().then(() => {
        uni.showToast({ title: '删除成功', icon: 'success' });
        this.loadData();
      }).catch(err2 => {
        const msg = (err2 && (err2.errMsg || err2.message)) || fallbackReason || '删除失败';
        uni.showModal({ title: '删除失败', content: msg, showCancel: false });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-area {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
