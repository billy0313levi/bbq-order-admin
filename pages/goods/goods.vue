<template>
	<view class="page-body">
		<!-- 页面内容开始 -->

		<!-- 表格搜索组件开始 -->
		<vk-data-table-query v-model="queryForm1.formData" :columns="queryForm1.columns" @search="search">
		</vk-data-table-query>
		<!-- 表格搜索组件结束 -->

		<!-- 自定义按钮区域开始 -->
		<view>
			<el-row>
				<el-button type="success" size="small" icon="el-icon-circle-plus-outline" @click="addBtn">添加</el-button>
				<!-- 批量操作 -->
				<el-dropdown v-if="table1.multipleSelection" :split-button="false" trigger="click" @command="batchBtn">
					<el-button type="danger" size="small" style="margin-left: 20rpx;"
						:disabled="table1.multipleSelection.length === 0">0
						批量操作<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item :command="1">设置估清</el-dropdown-item>
						<!-- <el-dropdown-item :command="2">批量操作2</el-dropdown-item> -->
					</el-dropdown-menu>
				</el-dropdown>
			</el-row>
		</view>
		<!-- 自定义按钮区域结束 -->

		<!-- 表格组件开始 -->
		<vk-data-table ref="table1" :action="table1.action" :columns="table1.columns" :query-form-param="queryForm1"
			:right-btns="['update','delete']" :selection="true" :row-no="true" :pagination="true" :custom-right-btns="[{
						title:'SKU',
						icon:'el-icon-shopping-cart-2',
						type:''
					},{
						title:'估清',
						icon:'vk-icon-attentionforbid',
						type:''
					}]" @update="updateBtn" @delete="deleteBtn" @current-change="currentChange" @selection-change="selectionChange"
			@custom-right-btns="customRightBtns">
			<!-- <template v-slot:stock="{ row, column, index }">
				<text>
					{{ stockFn(row.sku_list) }}
				</text>
			</template> -->
		</vk-data-table>
		<!-- 表格组件结束 -->

		<!-- 添加或编辑的弹窗开始 -->
		<!-- <vk-data-dialog v-model="form1.props.show" :title="form1.props.title" width="500px" mode="form"
			:close-on-click-modal="false">
			<vk-data-form v-model="form1.data" :rules="form1.props.rules" :action="form1.props.action"
				:form-type="form1.props.formType" :columns='form1.props.columns' label-width="80px"
				@success="form1.props.show = false;refresh();"></vk-data-form>
		</vk-data-dialog> -->
		<el-drawer :title="form1.props.title" :visible.sync="form1.props.show" width="40%" size="45%">
			<view style="padding: 20px;">
				<vk-data-form v-model="form1.data" :rules="form1.props.rules" :action="form1.props.action"
					:form-type="form1.props.formType" :columns='form1.props.columns' label-width="120px"
					@success="form1.props.show = false;refresh();" :show-cancel="false"></vk-data-form>
			</view>
		</el-drawer>
		<!-- 添加或编辑的弹窗结束 -->
		<vk-data-dialog v-model="skuDetailDialog.show" width="1000px" top="14vh" center :close-on-click-modal="true">
			<vk-data-detail-table :data="table1.selectItem" :columns="skuDetailDialog.columns"></vk-data-detail-table>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" size="medium" @click="skuDetailDialog.show=false">关 闭</el-button>
			</span>
		</vk-data-dialog>
		<!-- 页面内容结束 -->
	</view>
</template>

<script>
	var that; // 当前页面对象
	var vk = uni.vk; // vk实例
	var originalForms = {}; // 表单初始化数据

	export default {
		data() {
			// 页面数据变量
			return {
				// 页面是否请求中或加载中
				loading: false,
				// init请求返回的数据
				data: {

				},
				// 表格相关开始 -----------------------------------------------------------
				table1: {
					// 表格数据请求地址
					action: "admin/object/sys.goods.kh_getList",
					// 表格字段显示规则
					columns: [
						{
							key: "goodsLogo",
							title: "图片",
							type: "avatar",
						},
						// {
						// 	key: "store.storeName",
						// 	title: "所属门店",
						// 	type: "text",
						// },
						{
							key: "category.categoryName",
							title: "商品类目",
							type: "text",
						},
						{
							key: "goodsName",
							title: "商品名称",
							type: "text",
						},
						// {
						// 	key: "price",
						// 	title: "商品价格",
						// 	type: "text",
						// },
						{
							key: "sku_list",
							title: "价格区间",
							type: "text",
							defaultValue: '暂无',
							formatter: (val, row, column, index) => {
								let price = '';
								if (val && Array.isArray(val)) {
									for (let i = 0; i < val.length; i++) {
										let item = val[i] || {};
										if (item.isDefault === true) {
											price = item.price;
											break;
										}
									}
									if (!price && val.length > 0) {
										price = val[0].price;
									}
								} else if (row && row.price) {
									price = row.price;
								}
								return vk.pubfn.priceFilter(price || 0);
							}
						},
						{
							key: "salesVolume",
							title: "销量",
							type: "text",
						},
						// {
						// 	key: "stock",
						// 	title: "商品库存",
						// 	type: "number",
						// 	show: ["row"]
						// },
						// {
						// 	key: "inventory",
						// 	title: "库存",
						// 	type: "text",
						// },
						{
							key: "delivery",
							title: "是否上架",
							type: "switch",
							watch: (res) => {
								let {
									value,
									row,
									change
								} = res;
								vk.callFunction({
									url: "admin/object/sys.goods.sys_updateIsOnSale",
									title: value ? "上架中..." : "下架中...",
									data: {
										ids: [row._id],
										delivery: value
									},
									success: data => {
										change(value);
									}
								});
							}
						},
						{
							key: "_add_time_str",
							title: "添加时间",
							type: "time",
							// sortable: "custom",
							width: 160
						},
					],
					// 多选框选中的值
					multipleSelection: [],
					// 当前高亮的记录
					selectItem: ""
				},
				// 表格相关结束 -----------------------------------------------------------
				// 表单相关开始 -----------------------------------------------------------
				// 查询表单请求数据
				queryForm1: {
					// 查询表单数据源，可在此设置默认值
					formData: {

					},
					// 查询表单的字段规则 fieldName:指定数据库字段名,不填默认等于key
					columns: [{
						key: "_add_time",
						title: "添加时间",
						type: "datetimerange",
						width: 400,
						mode: "[]"
					}, ]
				},
				form1: {
					// 表单请求数据，此处可以设置默认值
					data: {
						status: false,
						start: 1,
						delivery: true,
						salesVolume: 0,
						isVip: false,
					},
					// 表单属性
					props: {
						// 表单请求地址
						action: "",
						// 表单字段显示规则
						columns: [{
								key: "",
								title: "基本信息",
								type: "bar-title"
							},
							{
								key: "goodsLogo",
								title: "商品图片",
								type: "image",
								limit: 1
							},
							{
								key: "goodsLogos",
								title: "商品轮播图",
								type: "image",
								limit: 6,
								tips: "轮播图最多可上传6张"
							},
							{
								key: "goodsName",
								title: "商品名称",
								type: "text",
								placeholder: "请输入商品名称"
							},
							{
								key: "content",
								title: "商品描述",
								type: "textarea",
								autosize: {
									minRows: 4,
									maxRows: 10
								},
								maxlength: 100,
								showWordLimit: true,
							},
							{
								key: "categoryId",
								title: "商品类目",
								type: "remote-select",
								placeholder: "请选择商品类目",
								action: "admin/object/sys.category.kh_findCategoryByUid",
								props: {
									list: "rows",
									value: "_id",
									label: "categoryName"
								},
								showAll: true,
							},
							{
								key: "start",
								title: "商品起售",
								type: "number",
								controls: true
							},
							{
								key: "salesVolume",
								title: "初始销量",
								type: "number",
								controls: true
							},
							{
								key: "",
								title: "商品配置",
								type: "bar-title"
							},
							{
								key: "delivery",
								title: "是否上架",
								type: "switch",
								activeValue: true,
								inactiveValue: false,
								width: 100
							},
							{
								key: "isVip",
								title: "禁用会员价",
								type: "switch",
								tips: "禁用后，该商品不能使用会员价进行优惠！"
							},
							{ key:"rate", title:"推荐度", type:"rate", allowHalf:false },
							{
								key: "goods_sku",
								title: "",
								type: "goods-sku",
								showLabel: false,
								props: {
									spec_list: "spec_list",
									sku_list: "sku_list"
								},
								max: 1
							},
						],
						// 表单验证规则
						rules: {

						},
						// add 代表添加 update 代表修改
						formType: "",
						// 是否显示表单的弹窗
						show: false
					}
				},
				skuDetailDialog: {
					show: false,
					columns: [{
							key: "spec_list",
							title: "规格组列表",
							type: "table",
							width: 160,
							defaultValue: '暂无',
							show: ["detail"],
							columns: [{
									key: "name",
									title: "规格名",
									type: "tag",
									width: 100,
									size: "medium",
									formatter: function(val, row, column, index) {
										return {
											val: val,
											tagType: ""
										};
									}
								},
								{
									key: "list",
									title: "规格值",
									type: "html",
									minWidth: 100,
									align: "left",
									formatter: function(val = [], row, column, index) {
										let str = "";
										for (let i = 0; i < val.length; i++) {
											str +=
												`<span class="el-tag el-tag--medium el-tag--plain">${val[i].name}</span>`;
											if (i < (val.length - 1)) {
												str += " ";
											}
										}
										return str;
									}
								},
							]
						},
						{
							key: "sku_list",
							title: "sku列表",
							type: "table",
							width: 160,
							show: ["detail"],
							// rowHeight:56,
							columns: [
								// {
								// 	key: "image",
								// 	title: "商品图片",
								// 	type: "avatar"
								// },
								{
									key: "sku_name",
									title: "SKU名称",
									type: "text"
								},
								{
									key: "price",
									title: "价格",
									type: "money"
								},
								{
									key: "vipPrice",
									title: "会员价",
									type: "money",
									defaultValue: "未设置"
								},
								// {
								// 	key: "stock",
								// 	title: "库存",
								// 	type: "number",
								// 	defaultValue: 0
								// },
								// { key:"weight", title:"重量", type:"number", width:100, defaultValue:0 },
								// { key:"real_sell_count", title:"销量", type:"number", width:100, defaultValue:0 },
								//{ key:"vip_price_rules", title:"单独会员价规则", type:"text", width:150, defaultValue:'无' },
							]
						},
					]
				},
				// 其他弹窗表单
				formDatas: {},
				// 表单相关结束 -----------------------------------------------------------
			};
		},
		// 监听 - 页面每次【加载时】执行(如：前进)
		onLoad(options = {}) {
			that = this;
			vk = that.vk;
			that.options = options;
			that.init(options);
		},
		// 监听 - 页面【首次渲染完成时】执行。注意如果渲染速度快，会在页面进入动画完成前触发
		onReady() {},
		// 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
		onShow() {},
		// 监听 - 页面每次【隐藏时】执行(如：返回)
		onHide() {},
		// 函数
		methods: {
			customRightBtns(row, btn) {
				if (btn.title === "SKU") {
					that.skuDetailDialog.show = true;
				} else if (btn.title === '估清') {
					console.log(row)
					console.log(that.table1.multipleSelection)
					that.table1.multipleSelection = []
					that.table1.multipleSelection.push(row)
					this.$confirm('此操作将对' + row.goodsName + '商品设置估清, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						that.$nextTick(function() {
							vk.callFunction({
									url: 'admin/object/sys.estimate.sys_adds',
								title: '请求中...',
								data: this.analysis(that.table1.multipleSelection)
							}).then((data) => {
								this.$message({
									type: 'success',
									message: '设置成功!'
								});
								this.refresh()
							}).catch((err) => {
								this.$message({
									type: 'info',
									message: '设置失败！'
								});
								this.refresh()
							});
						});

					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消设置'
						});
						this.refresh()
					});
				}
			},
			stockFn(value) {
				let allStock = 0;
				if (vk.pubfn.isNotNull(value)) {
					value.map((item, index) => {
						allStock += parseInt(item.stock);
					});
				}
				return parseInt(allStock);
			},
			// 页面数据初始化函数
			init(options) {
				originalForms["form1"] = vk.pubfn.copyObject(that.form1);
			},
			// 页面跳转
			pageTo(path) {
				vk.navigateTo(path);
			},
			// 表单重置
			resetForm() {
				vk.pubfn.resetForm(originalForms, that);
			},
			// 搜索
			search() {
				that.$refs.table1.search();
			},
			// 刷新
			refresh() {
				that.$refs.table1.refresh();
				// that.resetForm()
				// location.reload();
			},
			// 获取当前选中的行的数据
			getCurrentRow() {
				return that.$refs.table1.getCurrentRow();
			},
			// 监听 - 行的选中高亮事件
			currentChange(val) {
				that.table1.selectItem = val;
			},
			// 当选择项发生变化时会触发该事件
			selectionChange(list) {
				console.log(list)
				that.table1.multipleSelection = list;
			},
			// 显示添加页面
			addBtn() {
				that.resetForm();
				that.form1.props.action = 'admin/object/sys.goods.add';
				that.form1.props.formType = 'add';
				that.form1.props.title = '添加';
				that.form1.props.show = true;
			},
			// 显示修改页面
			updateBtn({
				item
			}) {
				that.form1.props.action = 'admin/object/sys.goods.edit';
				that.form1.props.formType = 'update';
				that.form1.props.title = '编辑';
				that.form1.props.show = true;
				that.form1.data = item;
			},
			// 删除按钮
			deleteBtn({
				item,
				deleteFn
			}) {
				deleteFn({
					action: "admin/object/sys.goods.del",
					data: {
						_id: item._id
					},
				});
			},
			// 监听 - 批量操作的按钮点击事件
			batchBtn(index) {
				switch (index) {
					case 1:
						this.$confirm('此操作将对勾选商品设置估清, 是否继续?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							// let list = vk.pubfn.arrayObjectGetArray(that.table1.multipleSelection, "_id");
							// console.log(list)
							that.$nextTick(function() {
								vk.callFunction({
									url: 'admin/object/sys.estimate.add',
									title: '请求中...',
									data: this.analysis(that.table1.multipleSelection)
								}).then((data) => {
									this.$message({
										type: 'success',
										message: '设置成功!'
									});
									this.refresh()
								}).catch((err) => {
									this.$message({
										type: 'info',
										message: '设置失败！'
									});
									this.refresh()
								});
							});

						}).catch(() => {
							this.$message({
								type: 'info',
								message: '已取消设置'
							});
							this.refresh()
						});
						break;
					case 2:
						vk.toast("批量操作按钮2");
						break;
					default:
						break;
				}
			},
			analysis(data) {
				let list = []
				for (var i = 0; i < data.length; i++) {
					list.push({
						goodsId: data[i]._id,
						uid: data[i].uid,
						_add_time_str: vk.pubfn.timeFormat(new Date(), "yyyy-MM-dd hh:mm:ss"),
						_add_time: new Date().getTime(),
						goodsName: data[i].goodsName,
						categoryName: (data[i].category && (data[i].category.categoryName || data[i].category.name)) || '',
						logo: data[i].goodsLogo || data[i].img,
						categoryId: data[i].categoryId
					})
				}
				return list;
			}
		},
		// 监听属性
		watch: {

		},
		// 过滤器
		filters: {

		},
		// 计算属性
		computed: {

		}
	};
</script>
<style lang="scss" scoped>
	.page-body {}
</style>
