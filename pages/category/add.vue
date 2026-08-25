<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="categoryName" label="分类名称" required>
        <uni-easyinput placeholder="菜品分类名称（新字段）" v-model="formData.categoryName" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="name" label="分类名称">
        <uni-easyinput placeholder="菜品分类名称（兼容旧字段）" v-model="formData.name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="categoryLogo" label="分类图片">
        <uni-easyinput placeholder="分类图片（新字段）" v-model="formData.categoryLogo"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="icon" label="分类图标/图片">
        <uni-easyinput placeholder="分类图片（兼容旧字段）" v-model="formData.icon"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="sort" label="排序">
        <uni-easyinput placeholder="排序值，越小越靠前" type="number" v-model="formData.sort"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="delivery" label="是否启用">
        <switch @change="binddata('delivery', $event.detail.value)" :checked="formData.delivery"></switch>
      </uni-forms-item>
      <uni-forms-item name="status" label="状态">
        <uni-data-checkbox v-model="formData.status" :localdata="formOptions.status_localdata"></uni-data-checkbox>
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
  import { validator } from '../../js_sdk/validator/category.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'category';

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
        "categoryName": "",
        "name": "",
        "categoryLogo": "",
        "icon": "",
        "sort": 0,
        "delivery": true,
        "status": 1,
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
        const data = {
          ...value,
          // 兼容字段双写
          name: value.categoryName,
          icon: value.categoryLogo
        };
        if (typeof data.delivery !== 'undefined') {
          data.status = (data.delivery === true || data.delivery === 1) ? 1 : 0;
        }
        return db.collection(dbCollectionName).add(data).then((res) => {
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
