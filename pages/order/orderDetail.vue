<template>
	<vk-data-drawer v-model="value.show" :title="page.title" :top="page.top" :width="page.width"
		:close-on-click-modal="true" center @open="onOpen" @closed="onClose">
		<view v-if="orderInfo && orderInfo._id">
			<view style="max-height:calc(100vh - 100px - 220px);overflow-y: auto;">
				<el-table :show-header="false" :data="tableData" :span-method="objectSpanMethod" border
					:cell-style="columnStyle"
					style="width: 100%; margin-top: 0px;margin-bottom:10px; border: 1px solid #e8e8e8; border-bottom: 0; ">
					<el-table-column width="180" prop="title1"></el-table-column>
					<el-table-column prop="value1">
						<template slot-scope="scope">
							<view v-if="scope.row.title1 === '订单购买者信息'"
								style="display: flex;height: 40px;line-height: 40px;">
								<el-image :src="orderInfo.users.avatarUrl || orderInfo.users.avatar"
									v-if="orderInfo.users && (orderInfo.users.avatarUrl || orderInfo.users.avatar)"
									style="width: 40px;height: 40px;border-radius: 50px;"
									:preview-src-list="[orderInfo.users.avatarUrl || orderInfo.users.avatar]"></el-image>
								<view style="margin-left: 20px;">
									{{ (orderInfo.users && orderInfo.users.nickname ? orderInfo.users.nickname : '扫码用户') + "（" + (orderInfo.uid || '--') + "）" }}
								</view>
							</view>

							<view v-else-if="scope.row.title1 === '状态'">
								<el-tag :type="statusTagType(orderInfo.orderStatus)" effect="dark" size="medium" style="margin-right: 10px;">
									{{ statusFn(orderInfo.orderStatus) }}
								</el-tag>
								<el-tag type="success" effect="dark" size="medium"
									v-if="(orderInfo.payType === 'weixin' || orderInfo.payType === 'WECHAT') && orderInfo.orderStatus >= 1">微信</el-tag>
								<el-tag type="primary" effect="dark" size="medium"
									v-else-if="(orderInfo.payType === 'alipay' || orderInfo.payType === 'ALIPAY') && orderInfo.orderStatus >= 1">支付宝
								</el-tag>
								<el-tag type="warning" effect="dark" size="medium"
									v-else-if="(orderInfo.payType === 'yue' || orderInfo.payType === 'YUE') && orderInfo.orderStatus >= 1">账户余额</el-tag>
							</view>
							<view v-else-if="scope.row.title1 === '桌号'" style="font-weight:bold;color:#409eff;">
								{{ orderInfo.tableNo || orderInfo.tableId || '--' }}
							</view>
							<view v-else-if="scope.row.title1 === '买家备注'">
								<view v-if="orderInfo.remark != ''">
									<text>{{ orderInfo.remark }}</text>
								</view>
								<view v-else>暂无</view>
							</view>
							<view v-else :style="scope.row.style1">{{ scope.row.value1 || "--" }}</view>
						</template>
					</el-table-column>

					<el-table-column width="180" prop="title2"></el-table-column>

					<el-table-column prop="value2">
						<template slot-scope="scope">
							<view :style="scope.row.style2">{{ scope.row.value2 || "--" }}</view>
						</template>
					</el-table-column>
				</el-table>
			</view>
			<view style="margin-bottom: 120px;padding: 0 20px;">
				<el-table :data="orderInfo.orderCartInfo || []" :cell-style="{ 'text-align': 'center' }"
					:header-cell-style="{ 'text-align': 'center' }" border style="width: 100%;">
					<el-table-column prop="image" label="商品图片" width="80">
						<template slot-scope="scope">
							<el-image :src="scope.row.image || scope.row.img" style="width: 40px;"
								:preview-src-list="[scope.row.image || scope.row.img]">
							</el-image>
						</template>
					</el-table-column>
					<el-table-column prop="goodsName" label="商品名称" show-overflow-tooltip>
						<template slot-scope="scope">
							<view>{{ scope.row.goodsName || scope.row.name }}</view>
						</template>
					</el-table-column>
					<el-table-column prop="price" label="单价" width="120">
						<template slot-scope="scope">
							<view>{{ $fn.priceFilter(scope.row.price) }}</view>
						</template>
					</el-table-column>
					<el-table-column prop="number" label="购买数量" width="100">
						<template slot-scope="scope">
							<view>{{ scope.row.number || scope.row.count || 0 }}</view>
						</template>
					</el-table-column>
					<el-table-column prop="refund_num" label="退款数量" width="120">
						<template slot-scope="scope">
							<view>{{ scope.row.refund_num || 0 }}</view>
						</template>
					</el-table-column>
					<el-table-column prop="refund_amount" label="退款金额" width="120">
						<template slot-scope="scope">
							<view>{{ $fn.priceFilter(scope.row.refund_amount || 0) }}</view>
						</template>
					</el-table-column>
				</el-table>
			</view>
		</view>
		<template v-slot:footer>
			<view style="display:flex;gap:10px;justify-content:center;align-items:center;">
				<el-button type="success" size="medium" :loading="page.loading"
					@click="setStatus(2)">
					标记已完成
				</el-button>
				<el-button type="danger" size="medium" :loading="page.loading"
					@click="setStatus(3)">
					取消订单
				</el-button>
				<el-button type="primary" size="medium" style="width: 80px;" @click="close">
					关 闭
				</el-button>
			</view>
		</template>
	</vk-data-drawer>
</template>

<script>
	var that;
	var vk = uni.vk;
	export default {
		props: {
			value: {
				Type: Object,
				default: function() {
					return {
						show: false,
						mode: "",
						item: "",
						options: ""
					};
				}
			}
		},
		data: function() {
			return {
				page: {
					title: "订单详情",
					submitText: "关 闭",
					top: "2vh",
					width: "1200px",
					loading: false
				},
				orderInfo: {}
			};
		},
		mounted() {
			that = this;
			that.init();
		},
		methods: {
			init() {
				let { value } = that;
				that._input(value);
			},
			_input(value) {
				that.$emit("input", value);
			},
			onOpen() {
				that = this;
				let { value = {} } = that;
				let { item } = value;
				that.orderInfo = vk.pubfn.copyObject(item || {});
				// 状态兼容：旧字段 status -> 新 orderStatus
				if (typeof that.orderInfo.orderStatus === 'undefined' || that.orderInfo.orderStatus === null || that.orderInfo.orderStatus === '') {
					if (typeof that.orderInfo.status !== 'undefined' && that.orderInfo.status !== null) {
						const s = Number(that.orderInfo.status);
						// 旧字段映射: 1=制作中(已支付), 2=制作中, 3=已完成, 4=已取消
						const map = { 1: 1, 2: 1, 3: 2, 4: 3 };
						that.orderInfo.orderStatus = map[s] || 1;
					} else {
						that.orderInfo.orderStatus = 1;
					}
				}
			},
			onClose() {},
			open() {
				let { value } = that;
				value.show = true;
				that._input(value);
			},
			close() {
				let { value } = that;
				value.show = false;
				that._input(value);
			},
			setStatus(targetStatus) {
				const currentStatus = that.orderInfo.orderStatus;
				// 已完成或已取消的订单不允许再修改
				if (currentStatus === 2 || currentStatus === 3) {
					return;
				}
				let tip = '';
				if (targetStatus === 2) {
					tip = '确认将此订单标记为【已完成】？桌台将自动释放为空闲。';
				} else if (targetStatus === 3) {
					tip = '确认【取消】此订单？桌台将自动释放为空闲。';
				}
				that.$confirm(tip, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.page.loading = true;
					that.$emit('updateStatus', {
						_id: that.orderInfo._id,
						orderStatus: targetStatus
					});
					that.$emit('success');
					that.page.loading = false;
					setTimeout(() => { that.close(); }, 300);
				}).catch(() => {});
			},
			statusFn(val) {
				const data = [
					{ value: 0, label: "待支付" },
					{ value: 1, label: "制作中" },
					{ value: 2, label: "已完成" },
					{ value: 3, label: "已取消" }
				];
				const hit = data.find(x => x.value === val);
				return hit ? hit.label : '未知';
			},
			statusTagType(val) {
				const map = {
					0: 'danger',
					1: 'warning',
					2: 'success',
					3: 'info'
				};
				return map[val] || '';
			},
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if (columnIndex === 0 || columnIndex === 2 || columnIndex === 4) {
					return "background:#f8f8f8;text-align:center";
				} else {
					return "background:#ffffff;text-align:center";
				}
			},
			objectSpanMethod({ row, column, rowIndex, columnIndex }) {
				if ([5, 6, 7, 8, 9, 10, 11, 12].indexOf(rowIndex) > -1) {
					if (columnIndex === 1) {
						return [1, 3];
					} else if (columnIndex === 2 || columnIndex === 3) {
						return [0, 0];
					}
				}
			},
			copyAddress(address) {
				let text = `${address.formatted_address || address.street || ''} ${address.receiver_mobile || address.mobile || ''} ${address.receiver_name || address.accept_name || ''}`;
				uni.setClipboardData({
					data: text,
					success: () => { vk.toast('地址复制成功'); }
				});
			}
		},
		watch: {},
		computed: {
			tableData() {
				let that = this;
				let orderInfo = that.orderInfo || {};
				return [
					{
						title1: "订单购买者信息",
						value1: orderInfo.user_avatar || "--",
						title2: "订单id",
						value2: orderInfo._id || "--"
					},
					{
						title1: "状态",
						value1: typeof orderInfo.orderStatus !== 'undefined' ? orderInfo.orderStatus : "暂无",
						title2: "订单号",
						value2: orderInfo.orderNo || "--"
					},
					{
						title1: "桌号",
						value1: orderInfo.tableNo || orderInfo.tableId || "--",
						title2: "下单时间",
						value2: orderInfo._add_time_str || "--"
					},
					{
						title1: "订单应收",
						value1: vk.pubfn.priceFilter(orderInfo.totalAmount || orderInfo.totalPrice || 0),
						title2: "订单实收",
						value2: vk.pubfn.priceFilter(orderInfo.netReceipts || orderInfo.totalPrice || 0)
					},
					{
						title1: "包装费",
						value1: vk.pubfn.priceFilter(orderInfo.packingFee || 0),
						title2: "配送费",
						value2: vk.pubfn.priceFilter(orderInfo.distributionFee || 0)
					},
					{
						title1: "优惠",
						value1: vk.pubfn.priceFilter(orderInfo.discount || 0),
						title2: "支付方式",
						value2: (function(pt) {
							if (!pt) return '--';
							const m = { WECHAT: '微信', ALIPAY: '支付宝', YUE: '账户余额', weixin: '微信', alipay: '支付宝', yue: '账户余额' };
							return m[pt] || pt;
						})(orderInfo.payType)
					},
					{
						title1: "买家备注",
						value1: orderInfo.remark || "暂无",
						title2: "--",
						value2: "--"
					},
					{
						title1: "收货信息",
						value1: orderInfo.address ? (orderInfo.address.street || '') + (orderInfo.address.door_number || '') : "--",
						title2: "--",
						value2: "--"
					}
				];
			}
		}
	};
</script>

<style lang="scss" scoped></style>
