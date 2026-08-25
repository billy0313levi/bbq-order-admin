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
      <view v-if="formData.qrcodeImg" class="qrcode-preview">
        <text class="preview-label">当前小程序码：</text>
        <image :src="formData.qrcodeImg" mode="aspectFit" class="preview-img" @click="previewQrcode"></image>
        <text class="preview-url">场景值：{{ formData.qrcodeUrl }}</text>
        <button type="primary" size="mini" @click="regenerateQrcode">重新生成小程序码</button>
      </view>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" style="width: 100px;" :loading="submitting" :disabled="submitting" @click="submit">
          {{ submitting ? '保存中...' : '保存修改' }}
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
        "qrcodeUrl": "",
        "qrcodeImg": "",
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
        formDataId: ''
      }
    },
    onLoad(e) {
      if (e.id) {
        this.formDataId = e.id
        this.getDetail(e.id)
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
        uni.showLoading({ title: '正在保存...', mask: true })
        try {
          const updateData = {
            tableNo: this.formData.tableNo,
            capacity: this.formData.capacity,
            status: this.formData.status
          }
          if (this.formData.qrcodeUrl) {
            updateData.qrcodeUrl = this.formData.qrcodeUrl
          }
          if (this.formData.qrcodeImg) {
            updateData.qrcodeImg = this.formData.qrcodeImg
          }
          await db.collection(dbCollectionName).doc(this.formDataId).update(updateData)
          uni.showToast({ title: '修改成功', icon: 'success' })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 800)
        } catch (err) {
          uni.showModal({
            title: '保存失败',
            content: err.message || '请求服务失败',
            showCancel: false
          })
        } finally {
          this.submitting = false
          uni.hideLoading()
        }
      },
      async regenerateQrcode() {
        if (!this.formData.tableNo) {
          uni.showToast({ title: '请先填写桌号', icon: 'none' })
          return
        }
        uni.showLoading({ title: '正在生成小程序码...', mask: true })
        try {
          const qrCloudObj = uniCloud.importObject('tableQrManager')
          const result = await qrCloudObj.generate(this.formData.tableNo, this.formData.capacity || 4)
          if (result.code === 0 && result.data) {
            this.formData.qrcodeImg = result.data.qrcodeImg
            this.formData.qrcodeUrl = result.data.qrcodeUrl
            uni.showToast({ title: '生成成功', icon: 'success' })
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
          uni.hideLoading()
        }
      },
      previewQrcode() {
        if (!this.formData.qrcodeImg) return
        uni.previewImage({
          urls: [this.formData.qrcodeImg],
          current: this.formData.qrcodeImg
        })
      },
      getDetail(id) {
        uni.showLoading({ title: '加载中...', mask: true })
        db.collection(dbCollectionName).doc(id).get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = {
              tableNo: data.tableNo || '',
              qrcodeUrl: data.qrcodeUrl || '',
              qrcodeImg: data.qrcodeImg || '',
              capacity: data.capacity || 4,
              status: data.status || 0
            }
          }
        }).catch((err) => {
          uni.showModal({
            title: '加载失败',
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
        })
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
    cursor: pointer;
  }
  .preview-url {
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
  }
</style>
