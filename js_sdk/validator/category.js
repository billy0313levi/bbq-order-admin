// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "categoryName": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "分类名称",
    "label": "分类名称"
  },
  "name": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "分类名称",
    "label": "分类名称"
  },
  "categoryLogo": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "分类图片",
    "label": "分类图片"
  },
  "icon": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "分类图标/图片",
    "label": "分类图标/图片"
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
  "delivery": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "title": "是否启用",
    "defaultValue": true,
    "label": "是否启用"
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
    "title": "状态",
    "defaultValue": 1,
    "label": "状态"
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
