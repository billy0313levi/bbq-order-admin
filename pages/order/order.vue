<template>
	<view class="page-body">
		<!-- 表格搜索组件开始 -->
		<vk-data-table-query v-model="queryForm1.formData" :columns="queryForm1.columns" @search="search">
		</vk-data-table-query>
		<!-- 表格搜索组件结束 -->

		<!-- 自定义按钮区域开始 -->
		<view>
			<el-row>
				<el-button type="danger" size="small" icon="el-icon-refresh" @click="refresh()">刷新</el-button>
			</el-row>
		</view>
		<!-- 自定义按钮区域结束 -->

		<!-- 表格组件开始 -->
		<vk-data-table ref="table1" :action="table1.action" :columns="table1.columns" :query-form-param="queryForm1"
			:selection="true" :row-no="true" :pagination="true" :custom-right-btns="table1.customRightBtns"
			right-btns-align="center" @current-change="currentChange"
			@selection-change="selectionChange">
		</vk-data-table>
		<!-- 表格组件结束 -->

		<!-- 订单详情 -->
		<orderDetail v-model="formDatas.orderDetail" @success="refresh" @updateStatus="handleUpdateStatus"></orderDetail>

		<!-- 页面内容结束 -->
	</view>
</template>

<script>
	var that;
	var vk = uni.vk;
	var originalForms = {};
	import orderDetail from './orderDetail'

	// 统一订单状态：0待支付 1制作中(已支付) 2已完成 3已取消
	var orderStatusData = [
		{ value: 0, label: "待支付" },
		{ value: 1, label: "制作中" },
		{ value: 2, label: "已完成" },
		{ value: 3, label: "已取消" }
	];
	var payTypeData = [
		{ value: 'WECHAT', label: "微信" },
		{ value: 'ALIPAY', label: "支付宝" },
		{ value: 'YUE', label: "余额" }
	];

	export default {
		components: {
			orderDetail
		},
		data() {
			return {
				loading: false,
				data: {},
				table1: {
					customRightBtns: [
						{
							title: '详情',
							type: 'primary',
							icon: 'el-icon-search',
							onClick: (item) => {
								vk.pubfn.openForm('orderDetail', { item });
							}
						},
						{
							title: '标记完成',
							type: 'success',
							icon: 'el-icon-check',
							show: (item) => {
								return item.orderStatus === 0 || item.orderStatus === 1;
							},
							onClick: (item) => {
								that.updateOrderStatus(item, 2, '确认标记该订单为【已完成】？完成后桌台将自动释放。');
							}
						},
						{
							title: '取消订单',
							type: 'danger',
							icon: 'el-icon-close',
							show: (item) => {
								return item.orderStatus !== 2 && item.orderStatus !== 3;
							},
							onClick: (item) => {
								that.updateOrderStatus(item, 3, '确认【取消】该订单？桌台将自动释放。');
							}
						}
					],
					action: "admin/object/sys.order.kh_getList",
					columns: [
						{
							key: "orderNo",
							title: "订单号",
							type: "text",
							width: 180
						},
						{
							key: "tableNo",
							title: "桌号",
							type: "text",
							width: 100,
							defaultValue: '--'
						},
						{
							key: "users.nickname",
							title: "昵称",
							type: "text",
							width: 140,
							defaultValue: '--'
						},
						{
							key: "totalAmount",
							title: "应收(元)",
							type: "text"
						},
						{
							key: "netReceipts",
							title: "实收(元)",
							type: "text"
						},
						{
							key: "discount",
							title: "优惠(元)",
							type: "text"
						},
						{
							key: "payType",
							title: "支付方式",
							type: "tag",
							defaultValue: 'YUE',
							data: [
								{ value: 'YUE', label: "余额", tagType: "warning" },
								{ value: 'WECHAT', label: "微信", tagType: "success" },
								{ value: 'ALIPAY', label: "支付宝", tagType: "primary" },
								{ value: 'weixin', label: "微信", tagType: "success" },
								{ value: 'alipay', label: "支付宝", tagType: "primary" },
								{ value: 'yue', label: "余额", tagType: "warning" }
							]
						},
						{
							key: "orderStatus",
							title: "订单状态",
							type: "tag",
							defaultValue: 0,
							data: [
								{ value: 0, label: "待支付", tagType: "danger" },
								{ value: 1, label: "制作中", tagType: "warning" },
								{ value: 2, label: "已完成", tagType: "success" },
								{ value: 3, label: "已取消", tagType: "info" }
							]
						},
						{
							key: "_add_time",
							title: "下单时间",
							type: "time",
							sortable: "custom",
							width: 180
						}
					],
					multipleSelection: [],
					selectItem: ""
				},
				queryForm1: {
					formData: {},
					columns: [{
						key: "_add_time",
						title: "下单时间",
						type: "datetimerange",
						width: 400,
						mode: "[]"
					}, {
						key: "orderStatus",
						title: "订单状态",
						type: "select",
						width: 160,
						mode: "custom",
						data: orderStatusData,
					}, {
						key: "payType",
						title: "支付方式",
						type: "select",
						width: 160,
						mode: "custom",
						data: payTypeData,
					}, {
						key: "tableNo",
						title: "桌号",
						type: "text",
						width: 140,
						mode: "%%"
					}]
				},
				form1: {
					data: {},
					props: {
						action: "",
						columns: [],
						rules: {},
						formType: "",
						show: false
					}
				},
				formDatas: {}
			};
		},
		onLoad(options = {}) {
			that = this;
			vk = that.vk;
			that.options = options;
			that.init(options);
		},
		onReady() {},
		onShow() {},
		onHide() {},
		methods: {
			init(options) {
				originalForms["form1"] = vk.pubfn.copyObject(that.form1);
			},
			handleUpdateStatus({ _id, orderStatus }) {
				vk.callFunction({
					url: 'admin/object/sys.order.sys_updateOrderStatus',
					title: '更新中...',
					data: { _id, orderStatus },
					success: () => {
						that.$message.success('订单状态已更新');
						that.refresh();
					}
				});
			},
			updateOrderStatus(item, orderStatus, tip) {
				that.$confirm(tip, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					vk.callFunction({
						url: 'admin/object/sys.order.sys_updateOrderStatus',
						title: '更新中...',
						data: {
							_id: item._id,
							orderStatus
						},
						success: () => {
							that.$message.success('操作成功');
							that.refresh();
						}
					});
				}).catch(() => {});
			},
			pageTo(path) {
				vk.navigateTo(path);
			},
			resetForm() {
				vk.pubfn.resetForm(originalForms, that);
			},
			search() {
				that.$refs.table1.search();
			},
			refresh() {
				that.$refs.table1.refresh();
			},
			getCurrentRow() {
				return that.$refs.table1.getCurrentRow();
			},
			currentChange(val) {
				that.table1.selectItem = val;
			},
			selectionChange(list) {
				that.table1.multipleSelection = list;
			}
		},
		watch: {},
		filters: {},
		computed: {}
	};
</script>
<style lang="scss" scoped>
	.page-body {}
</style>
