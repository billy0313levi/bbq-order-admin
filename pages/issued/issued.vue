<template>
	<view class="page-body">
		<!-- 页面内容开始 -->
		<!-- 自定义按钮区域开始 -->
		<view>
			<el-row>
				<el-button type="danger" size="small" icon="el-icon-refresh" @click="refresh()">刷新</el-button>
				<!-- 批量操作 -->
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
					:form-type="form1.props.formType" :columns='form1.props.columns' label-width="120px"
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
					action: "admin/object/sys.issued.kh_getList",
					// 表格字段显示规则
					columns: [{
							key: "couponType",
							title: "优惠券类型",
							type: "tag",
							width: 180,
							defaultValue: 0,
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
							width: 180
						},
						{
							key: "dataTimeArr",
							title: "领取日期",
							type: "text",
							width: 280,
							formatter: (val, row, column, index) => {
								let str = "";
								str = this.timestampToTime(val[0]) + ' 到 ' + this.timestampToTime(val[1])
								return str;
							}
						},
						{
							key: "count",
							title: "发布数量",
							type: "text",
							width: 230,
							formatter: (val, row, column, index) => {
								let str = "";
								if(row.type == 0){
									str = '不限量'
								}else{
									str = val
								}
								return str;
							}
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
						},
						{
							key: "_add_time_str",
							title: "发布时间",
							type: "time",
							width: 160,
							sortable: "custom"
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
			timestampToTime(timestamp) {
				// 时间戳为10位需*1000，时间戳为13位不需乘1000
				var date = new Date(timestamp);
				var Y = date.getFullYear() + "-";
				var M =
					(date.getMonth() + 1 < 10 ?
						"0" + (date.getMonth() + 1) :
						date.getMonth() + 1) + "-";
				var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
				var h = date.getHours() + ":";
				var m = date.getMinutes() + ":";
				var s = date.getSeconds();
				return Y + M + D + h + m + s;
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
				that.form1.props.action = 'admin/object/sys.issued.add';
				that.form1.props.formType = 'add';
				that.form1.props.title = '添加';
				that.form1.props.show = true;
			},
			// 显示修改页面
			updateBtn({
				item
			}) {
				that.form1.props.action = 'admin/object/sys.issued.edit';
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
					action: "admin/object/sys.issued.del",
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
