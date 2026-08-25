<!-- admin端sku设置组件 -->
<template>
	<view class="vk-data-input-goods-sku">
		<!-- spec_list 开始 -->
		<view class="sku-title"> {{ textdataFn('specTitle', '多规格') }} </view>
		<view class="spec-list-view">
			<view v-for="(item1, index1) in specListCom" :key="index1">
				<view class="spec-view">
					<view class="group-box">
						<view class="group-title">
							<view class="group-left-content">{{ textdataFn('specName','规格名') }}：</view>
							<view class="group-entry">
								<el-form-item :rules="isRequired" :prop="specListNameCom+'.' + index1 + '.name'" :inline-message="true" >
									<el-input class="input" size="small" v-model="item1.name" :placeholder="textdataFn('specNamePlaceholder', '输入规格名')" ></el-input>
								</el-form-item>
							</view>
							<view v-if="index1 > 0" class="group-place-entry">
								<vk-data-icon name="vk-icon-roundclosefill" size="20" class="pointer close-btn" @click="specRemove1(index1)" ></vk-data-icon>
							</view>
						</view>
						<view class="group-container">
							<view class="group-left-content">{{ textdataFn('specValue','规格值') }}：</view>
							<view v-for="(item2, index2) in item1.list" :key="index2" class="group-item" v-if="item1.name" >
								<el-form-item :rules="isRequired" :prop="specListNameCom+'.' + index1 + '.list.' + index2 + '.name'" :inline-message="true" >
									<el-input v-model="item2.name" :ref="'spec-list-' + index1 + '-' + index2" class="input" size="small" :placeholder="textdataFn('specValuePlaceholder','输入规格值')" @blur="saveCheck2(item2.name, item1.list, index2)" ></el-input>
								</el-form-item>
								<vk-data-icon name="vk-icon-roundclosefill" size="20" class="pointer close-btn" @click="specRemove2(item1, index2)" ></vk-data-icon>
							</view>
							<view v-if="item1.name" class="group-entry">
								<el-button class="button-new-tag" size="small" @click="specAdd2(item1, index1)"> {{ textdataFn('specValueAdd','添加规格值') }} </el-button>
							</view>
						</view>
						<view class="group-entry-border"></view>
					</view>
				</view>
			</view>
			<view class="group-box top-10">
				<view class="group-title">
					<el-button size="mini" type="primary" @click="specAdd1">{{ textdataFn('specNameAdd','添加规格项目') }}</el-button>
				</view>
			</view>
			<view style="color: #999;">
				{{ textdataFn('specTips', '如何设置单规格：只设置一个规格名，且规格名为默认，同时规格值也为默认，则视为单规格；多规格示例：规格名：颜色，规格值：红色、白色，规格名：内存，规格值：128G、256G') }}
			</view>
		</view>
		<!-- spec_list 结束 -->
		<!-- sku_list 开始 -->
		<view class="sku-list-view">
			<view class="sku-title"> {{ textdataFn('skuTitle', 'sku列表') }} </view>
			<el-table class="sku-list-table" :data="skuListCom" border :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
				<el-table-column v-for="(item,index) in tableTitleCom" :key="index" :label="item.name">
					<template slot-scope="scope">
						<view v-if="!item.key">
							<text>{{ scope.row.sku_name_arr[index] }}</text>
						</view>
						<!-- 图片 -->
						<el-form-item v-else-if="item.key === 'image'" class="sku-image" :prop="skuListNameCom+'.'+scope.$index+'.'+item.key" :inline-message="false">
							<!-- <vk-data-upload v-model="scope.row[item.key]" :limit="1" :disabled="scope.row.disabled"></vk-data-upload> -->
							<vk-data-input-file-select v-model="scope.row[item.key]" file-type="image" :disabled="scope.row.disabled"></vk-data-input-file-select>
						</el-form-item>
						<!-- 价格 -->
						<el-form-item v-else-if="item.key === 'price'" :rules="skuIsRequired" :prop="skuListNameCom+'.'+scope.$index+'.'+item.key" :inline-message="false">
							<vk-data-input-money :max="1000000000" v-model="scope.row[item.key]" size="mini" :placeholder="textdataFn('input', '输入')+item.name" :clearable="false" :disabled="scope.row.disabled" class="sku-input"></vk-data-input-money>
						</el-form-item>
						<!-- 市场价 -->
						<el-form-item v-else-if="item.key === 'vipPrice'" :prop="skuListNameCom+'.'+scope.$index+'.'+item.key">
							<vk-data-input-money :max="1000000000" v-model="scope.row[item.key]" size="mini" :placeholder="textdataFn('input','输入')+item.name" :clearable="false" :disabled="scope.row.disabled" class="sku-input"></vk-data-input-money>
						</el-form-item>
						<!-- 库存 -->
						<el-form-item v-else-if="item.key === 'stock'" :rules="skuIsRequired" :prop="skuListNameCom+'.'+scope.$index+'.'+item.key" :inline-message="false">
							<vk-data-input-number :max="100000000000" v-model="scope.row[item.key]" size="mini" :placeholder="textdataFn('input','输入')+item.name" :clearable="false" :disabled="scope.row.disabled" class="sku-input" :precision="0"></vk-data-input-number>
						</el-form-item>
						<!-- 重量 -->
						<!-- <el-form-item v-else-if="item.key === 'weight'" :rules="skuIsRequired" :prop="skuListNameCom+'.'+scope.$index+'.'+item.key" :inline-message="false">
							<vk-data-input-number :max="1000000000" v-model="scope.row[item.key]" size="mini" :placeholder="textdataFn('input','输入')+item.name" :clearable="false" :disabled="scope.row.disabled" class="sku-input" :precision="3"></vk-data-input-number>
						</el-form-item> -->
						<!-- 是否禁用 -->
						<view v-else-if="item.key === 'disabled'">
							<el-checkbox v-model="scope.row[item.key]" @input="disabledChange"></el-checkbox>
						</view>
					</template>
				</el-table-column>
			</el-table>
			<!-- sku_list 结束 -->
			<!-- 统一修改 开始 -->
			<view class="unify-view">
				<view class="unify-left-text">{{ textdataFn('unifyUpdate','统一修改') }}：</view>
				<view v-for="(item,index) in skuPopover.list" :key="index">
					<el-popover placement="top" width="160" v-model="item.show" @after-enter="inputFocus('input-'+item.key)">
						<vk-data-input class="unify-popover-input" :type="item.inputType" :max="10000000" v-model="item.value" size="mini" :placeholder="textdataFn('unify','统一')+item.label" :ref="'input-'+item.key" @keyup.enter.native="allPriceUpdate(item)" ></vk-data-input>
						<view style="text-align: right;margin-top: 10px;">
							<el-button size="mini" type="text" @click="item.show = false">{{ textdataFn('cancel','取消') }}</el-button>
							<el-button type="primary" size="mini" class="unified-update" @click="allPriceUpdate(item)">{{ textdataFn('update','修改') }}</el-button>
						</view>
						<el-button :icon="item.icon" class="unify-update-btn" slot="reference" size="mini" :type="item.type">{{ item.label }}</el-button>
					</el-popover>
				</view>
				<!-- </el-input> -->
			</view>
			<!-- 统一修改 结束 -->
		</view>

	</view>
</template>

<script>
export default {
	name: "vk-data-input-goods-sku",
	props: {
		value: {
			Type: Object,
			default: function() {
				return {

				};
			}
		},
		props: {
			Type: Object,
			default: function() {
				return {
					spec_list: 'spec_list',
					sku_list: 'sku_list'
				};
			}
		},
		textdata: {
			Type: Object,
			default: function() {
				return {

				};
			}
		},
		// 最大规格数
		max: {
			Type: Number,
			default: 5
		},

	},
	data: function() {
		// 组件创建时,进行数据初始化
		let { textdataFn, vk } = this;
		return {
			isRequired: [{ required: true, message: "该项不能为空", trigger: ["change"] }],
			skuIsRequired: [
				{ validator: (rule, value, callback,b)=>{
					let index = rule.field.split(".")[1];
					let key = rule.field.split(".")[2];
					let sku_list = this.value.sku_list;
					let item = sku_list[index];
					if (!item.disabled && vk.pubfn.isNull(item[key])) {
						callback(new Error('请输入'));
					} else {
						callback();
					}
				}, trigger: ['blur','change'] }
			],
			skuPopover: {
				list: [
					{ key: "price", label: textdataFn("price", "价格"), icon: "el-icon-coin", type: "success", show: false, value: "", inputType: "money" },
					{ key: "vipPrice", label: textdataFn("vipPrice","会员价"), icon: "el-icon-coin", type: "primary", show: false, value: "", inputType: "money" },
					{ key: "stock", label: textdataFn("stock","库存"), icon: "el-icon-s-home", type: "danger", show: false, value: "", inputType: "number" },
					// { key: "weight", label: textdataFn("weight","重量"), icon: "el-icon-s-cooperation", type: "info", show: false, value: "", inputType: "number" }
				]
			},
		};
	},
	created() {
		this.init();
	},
	mounted() {

	},
	methods: {
		// 初始化
		init() {
			let that = this;
			let { specListCom, skuListCom, vk } = that;
			if (vk.pubfn.isNull(specListCom)){
				specListCom = [{
					name: "默认",
					list: [
						{
							name: "默认"
						}
					]
				}];
			}
			if (vk.pubfn.isNull(skuListCom)){
				skuListCom = [];
			}

			that._updateValue({ specListCom, skuListCom });
		},
		// 向父组件发送更新value事件
		_updateValue(obj = {}) {
			let that = this;
			let { specListCom, skuListCom } = obj;
			let { value, props } = that;
			let { spec_list = "spec_list", sku_list = "sku_list" } = props;
			if (specListCom) that.$set(value, spec_list, specListCom)
			if (skuListCom) that.$set(value, sku_list, skuListCom);
			that.$emit("input", value);
		},
		// 规格组第一层添加
		specAdd1() {
			let that = this;
			let { specListCom = [], max = 3, vk } = that;
			if (specListCom.length >= max) {
				vk.toast(`最多支持${max}组规格`, "none");
				return false;
			}
			if (specListCom.length >= 1) {
				specListCom.push({
					name: "",
					list: [{ name: "" }]
				});
			}else{
				specListCom.push({
					name: "默认",
					list: [{ name: "默认" }]
				});
			}
			console.log(specListCom)
			that._updateValue({ specListCom });
		},
		// 规格组第二层添加
		specAdd2(item, index1) {
			let that = this;
			item.list.push({
				name: ""
			});
			that.$nextTick(function() {
				try {
					that.$refs[`spec-list-${index1}-${item.list.length - 1}`][0].focus();
				} catch (err) {}
			});
		},
		// 规则组标签第一层的关闭按钮事件
		specRemove1(index) {
			let that = this;
			let { specListCom=[] } = that;
			specListCom.splice(index, 1);
			that._updateValue({ specListCom });
		},
		// 规则组标签第二层的关闭按钮事件
		specRemove2(item, index) {
			item.list.splice(index, 1);
		},
		saveCheck2(value1, value2, index) {
			let that = this;
			for (let k = 0; k < value2.length; k++) {
				if (k != index) {
					if (value1 !== "" && value2[k].name === value1) {
						that.$message.error({ message: '规格值不允许重复!' });
						value2.splice(index, 1)
						return;
					}
				}
			}
		},
		//修改全部的属性
		allPriceUpdate(info) {
			let that = this;
			let { skuListCom=[] } = that;
			skuListCom.map((item, index) => {
				item[info.key] = info.value;
			});
			info.show = false;
			let nextInput = that.skuPopover.list[(that.skuPopover.list.indexOf(info)) + 1];
			if (info.value !== '' && nextInput) {
				nextInput.show = true
				that.$nextTick((x) => {
					that.$refs['input-' + nextInput.key][0].focus()
				})
			}
		},
		// 当disabled多选框改变时
		disabledChange() {
			// 这么做只是为了让vue渲染正确
			this.skuListCom.reverse().reverse();
		},
		// 使input输入框获得焦点
		inputFocus(name) {
			let that = this;
			if (that.$refs[name] && that.$refs[name][0]) that.$refs[name][0].focus();
		},
		// 计算sku_list
		calcSkuList() {
			let that = this;
			let { specListCom=[], skuListCom=[] } = that;
			let arr = [];
			specListCom.map((item1, index1) => {
				let itemArr = [];
				item1.list.map((item4, index4) => {
					itemArr.push(item4.name)
				});
				arr.push(itemArr);
			});
			// sku生成
			let allArr = that._cartesianProductOf(...arr);
			let newSkuList = [];
			if (skuListCom.length != allArr.length) {
				// 已改变sku数量时
				for (let i = 0; i < allArr.length; i++) {
					let item1 = allArr[i];
					let needPush = true;
					for (let j = 0; j < skuListCom.length; j++) {
						let item2 = skuListCom[j];
						if (JSON.stringify(item2.sku_name_arr) == JSON.stringify(item1)) {
							needPush = false;
							newSkuList.push(item2);
							break;
						}
					}
					if (needPush) {
						newSkuList.push({
							sku_name_arr: item1,
							sku_name: '', // sku名称
							image: "", // sku图片
							price: "", // sku价格
							vipPrice: "", // sku市场价
							stock: "", // sku库存
							// weight: "", // sku重量
							disabled: false, // 是否禁用
						});
					}
				}
			} else {
				// 未改变sku数量时
				for (let i = 0; i < allArr.length; i++) {
					let item1 = allArr[i];
					skuListCom[i].sku_name_arr = item1;
					newSkuList.push(skuListCom[i]);
				}
			}
			skuListCom = newSkuList;
			that._updateValue({ skuListCom });
		},
		// sku生成算法
		_cartesianProductOf() {
			return Array.prototype.reduce.call(arguments, function(a, b) {
				var ret = [];
				a.forEach(function(a) {
					b.forEach(function(b) {
						ret.push(a.concat([b]));
					});
				});
				return ret;
			}, [
				[]
			]);
		},
		textdataFn(name, defaultValue){
			let { textdata={} } = this;
			return textdata[name] || defaultValue || name;
		}
	},
	watch: {
		// 监听specListCom的更新
		specListCom: {
			immediate:true,
			deep: true,
			handler: function(newValue, oldValue) {
				this.calcSkuList();
			}
		}
	},
	// 计算属性
	computed: {
		// spec_list的值
		specListCom() {
			return this.value[this.specListNameCom];
		},
		// sku_list的值
		skuListCom() {
			return this.value[this.skuListNameCom];
		},
		// spec_list的字段名
		specListNameCom() {
			let { spec_list = "spec_list" } = this.props;
			return spec_list;
		},
		// sku_list的字段名
		skuListNameCom() {
			let { sku_list = "sku_list" } = this.props;
			return sku_list;
		},
		// sku渲染表格的标题
		tableTitleCom() {
			let { specListCom=[], textdataFn } = this;
			let titleArr = [];
			specListCom.map((item, index) => {
				titleArr.push(item);
			});
			let defaultArr = [
				{ key: "image", name: textdataFn("image", "图片") },
				{ key: "price", name: textdataFn("price","价格"), type: "money" },
				{ key: "vipPrice", name: textdataFn("vipPrice","会员价"), type: "money" },
				{ key: "stock", name: textdataFn("stock","库存"), type: "number" },
				// { key: "weight", name: textdataFn("weight","重量"), type: "number" },
				{ key: "disabled", name: textdataFn("disabled","是否禁用") },
			];
			defaultArr.map((item, index) => {
				titleArr.push(item);
			});
			return titleArr;
		}
	}
};

</script>

<style lang="scss" scoped>
.vk-data-input-goods-sku {
	/* 	多规格 */
	.spec-list-view {
		background-color: #fff;
		padding: 10px;
		border: 1px solid #e5e5e5;
		color: #303133;
		.spec-view {
		}
		.group-left-content {
			width: 60px;
		}
		.group-entry-border {
			border-top: 1px solid #e5e5e5;
		}
		.group-entry {
			width: 100px;
		}
		.group-box {
			position: relative;
			margin: 0;
			padding: 0;
			border: 0;
			vertical-align: baseline;
		}
		.top-10 {
			margin-top: 10px;
		}
		.group-title {
			display: flex;
			position: relative;
			padding: 7px 10px;
			margin: 0;
			background-color: #f8f8f8;
			font-size: 14px;
			font-weight: 400;
		}
		.group-title:hover .close-btn {
			display: block;
		}
		.group-container {
			display: flex;
			flex-wrap: wrap;
			padding: 7px 10px;
		}
		.group-place-entry {
			flex: 1;
			display: flex;
			justify-content: flex-end;
		}
		.el-input__inner {
			color: #333333;
		}
		.group-item {
			position: relative;
			width: 100px;
			margin-right: 10px;
		}
		.group-item:hover .close-btn {
			display: block;
		}
		.close-btn {
			position: absolute;
			top: -10px;
			right: -5px;
			opacity: 0.5;
			display: none;
		}
		.close-btn:hover {
			opacity: 1;
		}
	}

	/* 辅助工具样式 */
	.sku-title {
		padding: 6px;
		background-color: #f8f8f8;
		border-radius: 6px;
		color: #333333;
		font-weight: bold;
		padding-left: 15px;
		margin-bottom: 20px;
		font-size: 16px;
		line-height: 1.5;
	}

	/* 	sku列表 */
	.sku-list-view{
		margin-top: 20px;
		.sku-list-table{
			.sku-input{
				width: 90%;
				max-width: 140px;
			}
		}
	}

	/* 	统一修改 */
	.unify-view{
		display: flex;
		.unify-left-text{
			margin-top: 15px;
			font-size: 14px;
		}
		.unify-popover-input{
		  width: 90%;
			max-width: 160px;
			padding: 6px;
		}
		.unified-update{
			margin-right: 10px;
			padding: 4px 10px;
		}
		.unify-update-btn{
			margin-top: 20px;
			margin-right: 6px;
			margin-left: 3px;
		}
	}
}
</style>
