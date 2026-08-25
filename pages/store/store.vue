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
				<!-- <el-dropdown v-if="table1.multipleSelection" :split-button="false" trigger="click" @command="batchBtn">
					<el-button type="danger" size="small" style="margin-left: 20rpx;"
						:disabled="table1.multipleSelection.length === 0">
						批量操作<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item :command="1">批量操作1</el-dropdown-item>
						<el-dropdown-item :command="2">批量操作2</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown> -->
			</el-row>
		</view>
		<!-- 自定义按钮区域结束 -->

		<!-- 表格组件开始 -->
		<vk-data-table ref="table1" :action="table1.action" :columns="table1.columns" :query-form-param="queryForm1"
			:right-btns="['detail_auto','update','delete']" :selection="true" :row-no="true" :pagination="true"
			@update="updateBtn" @delete="deleteBtn" @current-change="currentChange" @selection-change="selectionChange">
		</vk-data-table>
		<!-- 表格组件结束 -->

		<!-- 添加或编辑的弹窗开始 -->
		<el-drawer :title="form1.props.title" :visible.sync="form1.props.show" width="40%" size="35%">
			<view style="padding: 20px;">
				<vk-data-form v-model="form1.data" :rules="form1.props.rules" :action="form1.props.action"
					:form-type="form1.props.formType" :columns='form1.props.columns' label-width="100px"
					@success="form1.props.show = false;refresh();"></vk-data-form>
			</view>
		</el-drawer>
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
					// 表格数据请求地址
					action: "admin/object/sys.store.kh_getList",
					// 表格字段显示规则
					columns: [{
							key: "storeLogo",
							title: "Logo",
							type: "avatar",
							width: 80
						},
						{
							key: "storeName",
							title: "门店名称",
							type: "text",
							width: 200
						},
						{
							key: "storePhone",
							title: "门店手机",
							type: "text",
							width: 180
						},
						{
							key: "storeProfile",
							title: "门店简介",
							type: "text",
							width: 200
						},
						{
							key: "storeAddress",
							title: "门店地址",
							type: "text",
							width: 200,
							formatter: (val, row, column, index) => {
								let str = "";
								str = val.province.name + '/' + val.city.name + '/' + val.area.name
								return str;
							}
						},
						{
							key: "detailedAddress",
							title: "详细地址",
							type: "text",
							width: 200,
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
				form1: {
					// 表单请求数据，此处可以设置默认值
					data: {
						integral: 0,
						startingPrice: 0,
						distributionFee: 0,
						packingFee: 0,
						delivery: true,
						isIntegral: false,
						isIcon: false
					},
					// 表单属性
					props: {
						// 表单请求地址
						action: "",
						// 表单字段显示规则
						columns: [{
								key: "storeLogo",
								title: "Logo",
								type: "image",
								limit: 1
							},
							{
								key: "storeLogos",
								title: "店内环境",
								type: "image",
								limit: 9
							},
							{
								key: "storeName",
								title: "门店名称",
								type: "text",
								placeholder: "请输入门店名称"
							},
							{
								key: "storePhone",
								title: "联系电话",
								type: "number"
							},
							{
								key: "storeAddress",
								title: "门店地址",
								type: "address"
							},
							{
								key: "detailedAddress",
								title: "详细地址",
								type: "text",
								placeholder: "请输入详细地址"
							},
							{
								key: "storeProfile",
								title: "门店简介",
								type: "text",
								placeholder: "请输入门店简介"
							},
							{
								key: "packingFee",
								title: "包装费",
								type: "number",
								controls: true
							},
							{
								key: "distributionFee",
								title: "配送费",
								type: "number",
								controls: true
							},
							{
								key: "startingPrice",
								title: "起送价",
								type: "number",
								controls: true
							},
							{
								key: "integral",
								title: "积分",
								type: "number",
								controls: true,
								tips: "每消费几元积一分"
							},
							{
								key: "businessHours",
								title: "营业时间",
								type: "time",
								isRange: true
							},
							{
								key: "delivery",
								title: "是否启用",
								type: "switch",
								activeValue: true,
								inactiveValue: false,
								width: 100
							},
							{
								key: "isIntegral",
								title: "禁用积分",
								type: "switch",
								activeValue: true,
								inactiveValue: false,
								width: 100
							},
							{
								key: "isIcon",
								title: "显示分类图片",
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
				that.form1.props.action = 'admin/object/sys.store.add';
				that.form1.props.formType = 'add';
				that.form1.props.title = '添加';
				that.form1.props.show = true;
			},
			// 显示修改页面
			updateBtn({
				item
			}) {
				that.form1.props.action = 'admin/object/sys.store.edit';
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
					action: "admin/object/sys.store.del",
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