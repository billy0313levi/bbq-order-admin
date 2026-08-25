<template>
	<view class="page-body">
		<!-- 页面内容开始 -->

		<!-- 表格搜索组件开始 -->
		<vk-data-table-query v-model="queryForm1.formData" :columns="queryForm1.columns" size="mini"
			@search="search"></vk-data-table-query>
		<!-- 表格搜索组件结束 -->

		<!-- 自定义按钮区域开始 -->
		<view>
			<el-row>
				<el-button type="success" size="mini" icon="el-icon-circle-plus-outline" @click="addBtn">添加</el-button>
			</el-row>
		</view>
		<!-- 自定义按钮区域结束 -->

		<!-- 表格组件开始 -->
		<vk-data-table ref="table1" :action="table1.action" :columns="table1.columns" :query-form-param="queryForm1"
			:right-btns="['update','delete']" :custom-right-btns="table1.customRightBtns"
			:default-sort="{ name:'sort', type:'asc' }" :selection="false" :row-no="true" :pagination="true" size="mini"
			@update="updateBtn" @delete="deleteBtn" @current-change="currentChange" @selection-change="selectionChange">
			<!-- 排序值 -->
			<template v-slot:sort="{ row, column, index }">
				<el-input v-model="row.sort" size="mini" @change="sortChange($event, row)" />
			</template>
		</vk-data-table>
		<!-- 表格组件结束 -->

		<!-- 添加或编辑的弹窗开始 -->
		<vk-data-dialog v-model="form1.props.show" :title="form1.props.title" width="500px" mode="form"
			:close-on-click-modal="true">
			<vk-data-form v-model="form1.data" :rules="form1.props.rules" :action="form1.props.action"
				:form-type="form1.props.formType" :columns='form1.props.columns' label-width="80px"
				@success="form1.props.show = false;refresh();"></vk-data-form>
		</vk-data-dialog>
		<!-- 添加或编辑的弹窗结束 -->

		<!-- 优惠券赠送 -->
		<!-- <giveCoupon v-model="formDatas.giveCoupon" @success="refresh"></giveCoupon> -->

		<!-- 页面内容结束 -->
	</view>
</template>

<script>
	var that; // 当前页面对象
	var vk = uni.vk; // vk实例
	var originalForms = {}; // 表单初始化数据
	// import giveCoupon from './form/giveCoupon'
	export default {
		components: {},
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
					action: "admin/object/sys.coupon.kh_getList",
					// 表格字段显示规则
					columns: [{
							key: "sort",
							title: "排序",
							type: "number",
							width: 80,
							defaultValue: '0',
							sortable: "custom"
						},
						{
							key: "status",
							title: "状态",
							type: "radio",
							itemWidth: 80,
							data: [{
									value: 0,
									label: "下架"
								},
								{
									value: 1,
									label: "上架"
								}
							]
						},
						{
							key: "name",
							title: "优惠券标题",
							type: "text",
							width: 150
						},
						{
							key: "receive_start_time",
							title: "最早可领取时间",
							type: "time",
							width: 150,
							sortable: "custom"
						},
						{
							key: "receive_end_time",
							title: "最晚可领取时间",
							type: "time",
							width: 150,
							sortable: "custom"
						},
						{
							key: "stock",
							title: "库存（张）",
							type: "number"
						},
						{
							key: "is_public",
							title: "可公开领取",
							type: "switch",
							activeValue: true,
							inactiveValue: false,
							watch: (res) => {
								let {
									value,
									row,
									change
								} = res;
								vk.callFunction({
									url: "admin/business/sys.coupon.updateBySwitch",
									title: "请求中...",
									data: {
										_id: row._id,
										is_public: value
									},
									success: data => {
										change(value); // 这一步是让表格行内的开关改变显示状态
									}
								});
							}
						},
						{
							key: "limit",
							title: "领取上限",
							type: "number",
							width: 100
						},
						{
							key: "describe",
							title: "使用说明",
							type: "text",
							width: 100,
							show: ["detail"]
						},
						{
							key: "_add_time",
							title: "添加时间",
							type: "time",
							width: 160,
							sortable: "custom"
						},
					],
					// 多选框选中的值
					multipleSelection: [],
					// 当前高亮的记录
					selectItem: "",
					// 自定义右侧按钮
					customRightBtns: [{
							title: '赠送',
							type: 'success',
							onClick: (item) => {
								vk.pubfn.openForm('giveCoupon', {
									item
								});
							}
						},
						{
							title: '复制创建',
							type: 'success',
							onClick: (item) => {
								vk.navigateTo({
									url: "./edit?mode=add",
									events: {
										// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
										add: (data) => {
											that.refresh();
										}
									},
									success: (res) => {
										// 通过eventChannel向被打开页面传送数据
										res.eventChannel.emit('data', item)
									}
								})
							}
						}
					],
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
							key: "remark",
							title: "备注",
							type: "text",
							width: 160,
							mode: "%%"
						},
						{
							key: "receive_start_time",
							title: "领取时间",
							type: "date",
							dateType: "date",
							width: 160,
							mode: "<="
						},
						{
							key: "receive_end_time",
							title: "-",
							type: "date",
							dateType: "date",
							width: 160,
							mode: ">="
						},
					]
				},
				form1: {
					// 表单请求数据，此处可以设置默认值
					data: {

					},
					// 表单属性
					props: {
						// 表单请求地址
						action: "",
						// 表单字段显示规则
						columns: [

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
				vk.navigateTo({
					url: "./edit?mode=add",
					events: {
						// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
						add: (data) => {
							that.refresh();
						}
					},
					success: (res) => {

					}
				})
			},
			// 显示修改页面
			updateBtn({
				item
			}) {
				vk.navigateTo({
					url: `./edit?mode=update&_id=${item._id}`,
					events: {
						// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
						update: (data) => {
							// 当B页面运行 eventChannel.emit('update', { a:1 }); 时，会运行这里的代码逻辑。
							vk.pubfn.objectAssign(item, data);
						}
					},
					success: (res) => {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('data', item)
					}
				})
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
			},
			sortChange(sort, item) {
				vk.callFunction({
					url: 'admin/object/sys.coupon.updateSort',
					data: {
						_id: item._id,
						sort: Number(sort)
					},
					success: (data) => {

					}
				});
			},
		},
		// 监听属性
		watch: {

		},
		// 计算属性
		computed: {

		}
	};
</script>
<style lang="scss" scoped>
	.page-body {}
</style>