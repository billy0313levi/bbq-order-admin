<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="orderNo" label="订单号" required>
        <uni-easyinput placeholder="唯一订单号，如：TX20260818xxxx" v-model="formData.orderNo" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="tableNo" label="桌号">
        <uni-easyinput placeholder="下单桌号（兼容旧字段），如：A01" v-model="formData.tableNo" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="tableId" label="桌号ID">
        <uni-easyinput placeholder="下单桌号（新字段），如：A01" v-model="formData.tableId" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="goodsList" label="商品明细（旧）">
        <uni-data-checkbox :multiple="true" v-model="formData.goodsList"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="orderCartInfo" label="商品明细（新）">
        <uni-data-checkbox :multiple="true" v-model="formData.orderCartInfo"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="totalPrice" label="总价（旧）">
        <uni-easyinput placeholder="订单应付总额（兼容旧字段），元" type="number" v-model="formData.totalPrice"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="totalAmount" label="订单应收">
        <uni-easyinput placeholder="应收金额（新字段），元" type="number" v-model="formData.totalAmount"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="netReceipts" label="订单实收">
        <uni-easyinput placeholder="实收金额（新字段），元" type="number" v-model="formData.netReceipts"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="discount" label="优惠金额">
        <uni-easyinput placeholder="优惠金额（新字段），元" type="number" v-model="formData.discount"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="packingFee" label="包装费">
        <uni-easyinput placeholder="包装费（新字段），元" type="number" v-model="formData.packingFee"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="distributionFee" label="配送费">
        <uni-easyinput placeholder="配送费（新字段），元" type="number" v-model="formData.distributionFee"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="remark" label="备注">
        <uni-easyinput placeholder="顾客备注，如：少辣、不要香菜" v-model="formData.remark" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="orderStatus" label="订单状态（新）">
        <uni-data-checkbox v-model="formData.orderStatus" :localdata="formOptions.orderStatus_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="status" label="订单状态（旧）">
        <uni-data-checkbox v-model="formData.status" :localdata="formOptions.status_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="payType" label="支付方式">
        <uni-easyinput placeholder="WECHAT微信 ALIPAY支付宝 YUE账户余额" v-model="formData.payType" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="uid" label="下单用户uid">
        <uni-easyinput placeholder="关联 uni-id-users 集合 _id" v-model="formData.uid"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="createTime" label="下单时间(旧)">
        <uni-datetime-picker return-type="timestamp" v-model="formData.createTime"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="updateTime" label="更新时间(旧)">
        <uni-datetime-picker return-type="timestamp" v-model="formData.updateTime"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="_add_time" label="下单时间(新)">
        <uni-datetime-picker return-type="timestamp" v-model="formData._add_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="_add_time_str" label="下单时间字符串">
        <uni-easyinput v-model="formData._add_time_str"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="_update_time" label="更新时间(新)">
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
  import { validator } from '../../js_sdk/validator/order.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'order';

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
        "orderNo": "",
        "tableNo": "",
        "tableId": "",
        "goodsList": [],
        "orderCartInfo": [],
        "totalPrice": null,
        "totalAmount": null,
        "netReceipts": null,
        "discount": 0,
        "packingFee": 0,
        "distributionFee": 0,
        "remark": "",
        "orderStatus": 0,
        "status": 2,
        "payType": "YUE",
        "uid": "",
        "createTime": null,
        "updateTime": null,
        "_add_time": null,
        "_add_time_str": "",
        "_update_time": null,
        "_update_time_str": ""
      }
      return {
        formData,
        formOptions: {
          "orderStatus_localdata": [
            {
              "value": 0,
              "text": 0
            },
            {
              "value": 1,
              "text": 1
            },
            {
              "value": 2,
              "text": 2
            },
            {
              "value": 3,
              "text": 3
            }
          ],
          "status_localdata": [
            {
              "value": 1,
              "text": 1
            },
            {
              "value": 2,
              "text": 2
            },
            {
              "value": 3,
              "text": 3
            },
            {
              "value": 4,
              "text": 4
            }
          ]
        },
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onLoad(e) {
      if (e.id) {
        const id = e.id
        this.formDataId = id
        this.getDetail(id)
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
        return db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
          uni.showToast({
            title: '修改成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      },

      /**
       * 获取表单数据
       * @param {Object} id
       */
      getDetail(id) {
        uni.showLoading({
          mask: true
        })
        db.collection(dbCollectionName).doc(id).field("orderNo,tableNo,tableId,goodsList,orderCartInfo,totalPrice,totalAmount,netReceipts,discount,packingFee,distributionFee,remark,orderStatus,status,payType,uid,createTime,updateTime,_add_time,_add_time_str,_update_time,_update_time_str").get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
            
          }
        }).catch((err) => {
          uni.showModal({
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
