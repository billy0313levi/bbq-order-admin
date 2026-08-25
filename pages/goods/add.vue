<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="goodsName" label="商品名称" required>
        <uni-easyinput placeholder="商品名称（新字段），如：羊肉串" v-model="formData.goodsName" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="name" label="菜品名称">
        <uni-easyinput placeholder="菜品名称（兼容旧字段），如：羊肉串" v-model="formData.name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="goodsLogo" label="商品主图">
        <uni-easyinput placeholder="商品主图（新字段）" v-model="formData.goodsLogo"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="goodsLogos" label="商品轮播图">
        <uni-data-checkbox :multiple="true" v-model="formData.goodsLogos"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="img" label="菜品图片">
        <uni-easyinput placeholder="菜品图片（兼容旧字段）" v-model="formData.img"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="imgs" label="菜品图片数组">
        <uni-data-checkbox :multiple="true" v-model="formData.imgs"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="price" label="售价">
        <uni-easyinput placeholder="默认SKU售价（兼容旧字段），单位：元" type="number" v-model="formData.price"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="categoryId" label="所属分类ID">
        <uni-easyinput placeholder="关联 category 集合 _id（新字段）" v-model="formData.categoryId"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="category_id" label="所属分类ID">
        <uni-easyinput placeholder="关联 category 集合 _id（兼容旧字段）" v-model="formData.category_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="content" label="商品描述">
        <uni-easyinput placeholder="商品介绍（新字段）" v-model="formData.content" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="desc" label="菜品简介">
        <uni-easyinput placeholder="菜品介绍（兼容旧字段）" v-model="formData.desc" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="sort" label="排序">
        <uni-easyinput placeholder="排序值，越小越靠前" type="number" v-model="formData.sort"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="stock" label="库存">
        <uni-easyinput placeholder="可售库存数量，0表示售罄" type="number" v-model="formData.stock"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="delivery" label="是否上架">
        <switch @change="binddata('delivery', $event.detail.value)" :checked="formData.delivery"></switch>
      </uni-forms-item>
      <uni-forms-item name="status" label="上架状态">
        <uni-data-checkbox v-model="formData.status" :localdata="formOptions.status_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="start" label="起售数量">
        <uni-easyinput placeholder="最少购买数量" type="number" v-model="formData.start"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="salesVolume" label="销量">
        <uni-easyinput placeholder="累计销量" type="number" v-model="formData.salesVolume"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="isVip" label="禁用会员价">
        <switch @change="binddata('isVip', $event.detail.value)" :checked="formData.isVip"></switch>
      </uni-forms-item>
      <uni-forms-item name="rate" label="推荐度">
        <uni-easyinput type="number" v-model="formData.rate"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="spec_list" label="规格组列表">
        <uni-data-checkbox :multiple="true" v-model="formData.spec_list"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="sku_list" label="SKU列表">
        <uni-data-checkbox :multiple="true" v-model="formData.sku_list"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="uid" label="创建者uid">
        <uni-easyinput v-model="formData.uid"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="_add_time" label="添加时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData._add_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="_add_time_str" label="添加时间字符串">
        <uni-easyinput v-model="formData._add_time_str"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="_update_time" label="更新时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData._update_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="_update_time_str" label="更新时间字符串">
        <uni-easyinput v-model="formData._update_time_str"></uni-easyinput>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
        <navigator open-type="navigateBack" style="margin-left: 15px;">
          <button class="uni-button" style="width: 100px;">返回</button>
        </navigator>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/goods.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'goods';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.includes(key)) {
        result[key] = validator[key]
      }
    }
    return result
  }

  

  export default {
    data() {
      let formData = {
        "goodsName": "",
        "name": "",
        "goodsLogo": "",
        "goodsLogos": [],
        "img": "",
        "imgs": [],
        "price": null,
        "categoryId": "",
        "category_id": "",
        "content": "",
        "desc": "",
        "sort": 0,
        "stock": 9999,
        "delivery": true,
        "status": 1,
        "start": 1,
        "salesVolume": 0,
        "isVip": false,
        "rate": 0,
        "spec_list": [],
        "sku_list": [],
        "uid": "",
        "_add_time": null,
        "_add_time_str": "",
        "_update_time": null,
        "_update_time_str": ""
      }
      return {
        formData,
        formOptions: {
          "status_localdata": [
            {
              "value": 0,
              "text": 0
            },
            {
              "value": 1,
              "text": 1
            }
          ]
        },
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      
      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      }
    }
  }
</script>
