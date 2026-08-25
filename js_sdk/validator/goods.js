// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "goodsName": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "商品名称",
    "label": "商品名称"
  },
  "name": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "菜品名称",
    "label": "菜品名称"
  },
  "goodsLogo": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "商品主图",
    "label": "商品主图"
  },
  "goodsLogos": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "title": "商品轮播图",
    "label": "商品轮播图"
  },
  "img": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "菜品图片",
    "label": "菜品图片"
  },
  "imgs": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "title": "菜品图片数组",
    "label": "菜品图片数组"
  },
  "price": {
    "rules": [
      {
        "format": "double"
      },
      {
        "minimum": 0
      }
    ],
    "title": "售价",
    "label": "售价"
  },
  "categoryId": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "所属分类ID",
    "label": "所属分类ID"
  },
  "category_id": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "所属分类ID",
    "label": "所属分类ID"
  },
  "content": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "商品描述",
    "label": "商品描述"
  },
  "desc": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "菜品简介",
    "label": "菜品简介"
  },
  "sort": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "排序",
    "defaultValue": 0,
    "label": "排序"
  },
  "stock": {
    "rules": [
      {
        "format": "int"
      },
      {
        "minimum": 0
      }
    ],
    "title": "库存",
    "defaultValue": 9999,
    "label": "库存"
  },
  "delivery": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "title": "是否上架",
    "defaultValue": true,
    "label": "是否上架"
  },
  "status": {
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
          }
        ]
      }
    ],
    "title": "上架状态",
    "defaultValue": 1,
    "label": "上架状态"
  },
  "start": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "起售数量",
    "defaultValue": 1,
    "label": "起售数量"
  },
  "salesVolume": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "销量",
    "defaultValue": 0,
    "label": "销量"
  },
  "isVip": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "title": "禁用会员价",
    "defaultValue": false,
    "label": "禁用会员价"
  },
  "rate": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "推荐度",
    "defaultValue": 0,
    "label": "推荐度"
  },
  "spec_list": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "title": "规格组列表",
    "label": "规格组列表"
  },
  "sku_list": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "title": "SKU列表",
    "label": "SKU列表"
  },
  "uid": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "创建者uid",
    "label": "创建者uid"
  },
  "_add_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "添加时间",
    "label": "添加时间"
  },
  "_add_time_str": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "添加时间字符串",
    "label": "添加时间字符串"
  },
  "_update_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "更新时间",
    "label": "更新时间"
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
  "status_valuetotext": {
    "0": 0,
    "1": 1
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
