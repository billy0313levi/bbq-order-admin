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
						:disabled="table1.multipleSelection.length === 0">
						批量操作<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item :command="1">批量操作1</el-dropdown-item>
						<el-dropdown-item :command="2">批量操作2</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-row>
		</view>
		<!-- 自定义按钮区域结束 -->

		<!-- 表格组件开始 -->
		<vk-data-table ref="table1" :action="table1.action" :columns="table1.columns" :query-form-param="queryForm1"
			:right-btns="['detail_auto','update','delete']" :selection="true" :row-no="true" :pagination="true"
			:custom-right-btns="table1.customRightBtns" right-btns-align="center" @update="updateBtn" @delete="deleteBtn"
			@current-change="currentChange" @selection-change="selectionChange">
		</vk-data-table>
		<!-- 表格组件结束 -->

		<!-- 添加或编辑的弹窗开始 -->
		<el-drawer :title="form1.props.title" :visible.sync="form1.props.show" width="40%" size="35%">
			<view style="padding: 20px;">
				<vk-data-form v-model="form1.data" :rules="form1.props.rules" :action="form1.props.action"
					:form-type="form1.props.formType" :columns='form1.props.columns' label-width="120px"
					@success="form1.props.show = false;refresh();"></vk-data-form>
			</view>
		</el-drawer>

		<vk-data-dialog v-model="form.props.show" :title="form.props.title" width="500px" mode="form"
			:close-on-click-modal="false">
			<vk-data-form v-model="form.data" :rules="form.props.rules" :action="form.props.action"
				:form-type="form.props.formType" :columns='form.props.columns' label-width="90px"
				@success="form.props.show = false;refresh();"></vk-data-form>
		</vk-data-dialog>
		<!-- 添加或编辑的弹窗结束 -->

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
					customRightBtns: [{
						title: '发布',
						type: 'warning',
						icon: 'vk-icon-top',
						onClick: (item) => {
							this.form.data.couponType = item.couponType
							this.form.data.couponName = item.couponName
							this.form.data.couponId = item._id
							this.form.props.show = true
						}
					}],
					// 表格数据请求地址
					action: "admin/object/sys.coupon.kh_getList",
					// 表格字段显示规则
					columns: [{
							key: "couponType",
							title: "优惠券类型",
							type: "tag",
							width: 120,
							defaultValue: 0,
							sortable: "custom",
							data: [{
									value: 0,
									label: "通用券",
									tagType: "success"
								},
								{
									value: 1,
									label: "商品券",
									tagType: "primary"
								}
							]
						},
						{
							key: "couponName",
							title: "优惠券名称",
							type: "text",
							width: 200
						},
						{
							key: "couponFee",
							title: "优惠券面值",
							type: "text",
							width: 160
						},
						{
							key: "couponMinFee",
							title: "优惠券最低消费",
							type: "text",
							width: 160
						},
						{
							key: "time",
							title: "有效期限(天)",
							type: "text",
							width: 160
						},
						{
							key: "sort",
							title: "排序",
							type: "text",
							width: 140
						},
						{
							key: "delivery",
							title: "状态",
							type: "tag",
							data: [{
									value: true,
									label: "启用",
									tagType: "success"
								},
								{
									value: false,
									label: "禁用",
									tagType: "danger"
								}
							]
						}
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
							key: "storeName",
							title: "门店名称",
							type: "text",
							width: 160,
							mode: "%%"
						},
						{
							key: "_add_time",
							title: "创建时间",
							type: "datetimerange",
							width: 400,
							mode: "[]"
						},
					]
				},
				form: {
					// 表单请求数据，此处可以设置默认值
					data: {
						couponType: 0,
						time: 1,
						delivery: true,
						type: 0,
						count: 0
					},
					// 表单属性
					props: {
						// 表单请求地址
						action: "admin/object/sys.issued.add",
						// 表单字段显示规则
						columns: [{
								key: "couponType",
								title: "优惠券类型",
								type: "radio",
								itemWidth: 80,
								data: [{
										value: 0,
										label: "通用券",
									},
									{
										value: 1,
										label: "商品券"
									}
								],
								disabled: true
							},
							{
								key: "couponName",
								title: "优惠券名称",
								type: "text",
								disabled: true
							},
							{
								key: "dataTimeArr",
								title: "领取日期",
								type: "date",
								dateType: "datetimerange"
							},
							{
								key: "type",
								title: "是否不限量",
								type: "radio",
								itemWidth: 80,
								data: [{
										value: 0,
										label: "不限量",
									},
									{
										value: 1,
										label: "限量"
									}
								],
							},
							{
								key: "count",
								title: "发布数量",
								type: "number",
								controls: true,
								showRule: "type==1",
							},
							{
								key: "delivery",
								title: "是否启用",
								type: "switch",
								activeValue: true,
								inactiveValue: false,
								width: 100
							}
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
				form1: {
					// 表单请求数据，此处可以设置默认值
					data: {
						couponType: 0,
						time: 1,
						sort: 1,
						delivery: true
					},
					// 表单属性
					props: {
						// 表单请求地址
						action: "",
						// 表单字段显示规则
						columns: [{
								key: "couponType",
								title: "优惠券类型",
								type: "radio",
								itemWidth: 80,
								data: [{
										value: 0,
										label: "通用券",
									},
									{
										value: 1,
										label: "商品券"
									}
								]
							},
							{
								key: "good_id",
								title: "选择商品",
								type: "table-select",
								placeholder: "请选择",
								action: "admin/object/sys.goods.kh_getList",
								columns: [{
										key: "_id",
										title: "序号",
										type: "text",
										idKey: true,
										show: ["none"]
									},
									{
										key: "logo",
										title: "图片",
										type: "avatar"
									},
									{
										key: "goodsName",
										title: "商品名称",
										type: "text",
										nameKey: true
									},
									{
										key: "price",
										title: "商品价格",
										type: "text"
									},
								],
								queryColumns: [{
									key: "goodsName",
									title: "商品名称",
									type: "text",
									width: 150,
									mode: "%%"
								}],
								showRule: "couponType==1",
								watch: ({
									value,
									formData,
									column,
									index,
									$set
								}) => {
									// 此处演示根据选择的值动态改变text1的值
									$set("couponMinFee", 58);
								}
								// onChange:(val, formData, column, index, option)=>{
								//     console.log(1,val, formData, column, index, option);
								//   }
							},
							{
								key: "couponName",
								title: "优惠券名称",
								type: "text",
							},
							{
								key: "couponFee",
								title: "优惠券面值",
								type: "number",
								controls: true
							},
							{
								key: "couponMinFee",
								title: "优惠券最低消费",
								type: "number",
								controls: true
							},
							{
								key: "time",
								title: "有效期限(天)",
								type: "number",
								controls: true
							},
							{
								key: "sort",
								title: "排序",
								type: "number",
								controls: true
							},
							// {
							// 	key: "deposit",
							// 	title: "押金",
							// 	type: "text",
							// 	placeholder: "请输入押金"
							// },
							{
								key: "delivery",
								title: "是否启用",
								type: "switch",
								activeValue: true,
								inactiveValue: false,
								width: 100
							}
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
				that.table1.multipleSelection = list;
			},
			// 显示添加页面
			addBtn() {
				that.resetForm();
				that.form1.props.action = 'admin/object/sys.coupon.add';
				that.form1.props.formType = 'add';
				that.form1.props.title = '添加';
				that.form1.props.show = true;
			},
			// 显示修改页面
			updateBtn({
				item
			}) {
				that.form1.props.action = 'admin/object/sys.coupon.edit';
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
					action: "admin/object/sys.coupon.del",
					data: {
						_id: item._id
					},
				});
			},
			// 监听 - 批量操作的按钮点击事件
			batchBtn(index) {
				switch (index) {
					case 1:
						vk.toast("批量操作按钮1");
						break;
					case 2:
						vk.toast("批量操作按钮2");
						break;
					default:
						break;
				}
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
