<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="tableNo" label="桌号" required>
        <uni-easyinput placeholder="桌号，如：A01、B02" v-model="formData.tableNo" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="capacity" label="容纳人数">
        <uni-easyinput placeholder="本桌可坐人数" type="number" v-model="formData.capacity"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="status" label="桌台状态">
        <uni-data-checkbox v-model="formData.status" :localdata="formOptions.status_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <view v-if="previewQrcodeImg" class="qrcode-preview">
        <text class="preview-label">小程序码预览：</text>
        <image :src="previewQrcodeImg" mode="aspectFit" class="preview-img"></image>
        <text class="preview-url">场景值：{{ previewQrcodeUrl }}</text>
      </view>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" style="width: 100px;" :loading="submitting" :disabled="submitting" @click="submit">
          {{ submitting ? '生成中...' : '生成并提交' }}
        </button>
        <navigator open-type="navigateBack" style="margin-left: 15px;">
          <button class="uni-button" style="width: 100px;">返回</button>
        </navigator>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/table.js';

  const db = uniCloud.database();
  const dbCollectionName = 'table';

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
        "tableNo": "",
        "capacity": 4,
        "status": 0
      }
      return {
        formData,
        formOptions: {
          "status_localdata": [
            { "value": 0, "text": "空闲" },
            { "value": 1, "text": "使用中" }
          ]
        },
        rules: {
          ...getValidator(Object.keys(formData))
        },
        submitting: false,
        previewQrcodeImg: '',
        previewQrcodeUrl: ''
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      async submit() {
        try {
          await this.$refs.form.validate()
        } catch (e) {
          return
        }
        this.submitting = true
        uni.showLoading({ title: '正在生成小程序码...', mask: true })
        try {
          const qrCloudObj = uniCloud.importObject('tableQrManager')
          const result = await qrCloudObj.generate(this.formData.tableNo, this.formData.capacity || 4)
          if (result.code === 0 && result.data) {
            this.previewQrcodeImg = result.data.qrcodeImg
            this.previewQrcodeUrl = result.data.qrcodeUrl
            uni.showToast({ title: '生成成功', icon: 'success' })
            this.getOpenerEventChannel().emit('refreshData')
            setTimeout(() => uni.navigateBack(), 800)
          } else {
            uni.showModal({
              title: '生成失败',
              content: result.msg || '请重试',
              showCancel: false
            })
          }
        } catch (err) {
          uni.showModal({
            title: '请求失败',
            content: err.message || '网络异常，请重试',
            showCancel: false
          })
        } finally {
          this.submitting = false
          uni.hideLoading()
        }
      }
    }
  }
</script>

<style scoped>
  .qrcode-preview {
    margin: 20px 0;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .preview-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }
  .preview-img {
    width: 200px;
    height: 200px;
    margin-bottom: 10px;
  }
  .preview-url {
    font-size: 12px;
    color: #999;
  }
</style>
