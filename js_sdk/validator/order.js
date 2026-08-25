// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "orderNo": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "订单号",
    "label": "订单号"
  },
  "tableNo": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "桌号",
    "label": "桌号"
  },
  "tableId": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "桌号ID",
    "label": "桌号ID"
  },
  "goodsList": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "title": "商品明细（旧）",
    "label": "商品明细（旧）"
  },
  "orderCartInfo": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "title": "商品明细（新）",
    "label": "商品明细（新）"
  },
  "totalPrice": {
    "rules": [
      {
        "format": "double"
      },
      {
        "minimum": 0
      }
    ],
    "title": "总价（旧）",
    "label": "总价（旧）"
  },
  "totalAmount": {
    "rules": [
      {
        "format": "double"
      },
      {
        "minimum": 0
      }
    ],
    "title": "订单应收",
    "label": "订单应收"
  },
  "netReceipts": {
    "rules": [
      {
        "format": "double"
      },
      {
        "minimum": 0
      }
    ],
    "title": "订单实收",
    "label": "订单实收"
  },
  "discount": {
    "rules": [
      {
        "format": "double"
      }
    ],
    "title": "优惠金额",
    "defaultValue": 0,
    "label": "优惠金额"
  },
  "packingFee": {
    "rules": [
      {
        "format": "double"
      }
    ],
    "title": "包装费",
    "defaultValue": 0,
    "label": "包装费"
  },
  "distributionFee": {
    "rules": [
      {
        "format": "double"
      }
    ],
    "title": "配送费",
    "defaultValue": 0,
    "label": "配送费"
  },
  "remark": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "备注",
    "label": "备注"
  },
  "orderStatus": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
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
        ]
      }
    ],
    "title": "订单状态（新）",
    "defaultValue": 0,
    "label": "订单状态（新）"
  },
  "status": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
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
      }
    ],
    "title": "订单状态（旧）",
    "defaultValue": 2,
    "label": "订单状态（旧）"
  },
  "payType": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "支付方式",
    "defaultValue": "YUE",
    "label": "支付方式"
  },
  "uid": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "下单用户uid",
    "label": "下单用户uid"
  },
  "createTime": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "下单时间(旧)",
    "label": "下单时间(旧)"
  },
  "updateTime": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "更新时间(旧)",
    "label": "更新时间(旧)"
  },
  "_add_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "下单时间(新)",
    "label": "下单时间(新)"
  },
  "_add_time_str": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "下单时间字符串",
    "label": "下单时间字符串"
  },
  "_update_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "更新时间(新)",
    "label": "更新时间(新)"
  },
  "_update_time_str": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "更新时间字符串",
    "label": "更新时间字符串"
  }
}

const enumConverter = {
  "orderStatus_valuetotext": {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3
  },
  "status_valuetotext": {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4
  }
}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
