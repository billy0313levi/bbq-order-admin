<template>
	<view class="page-body">
		<!-- 页面内容开始 -->
		<el-row>
			<el-col :span="24">
				<view class="separate_page">
					<h3>用户统计</h3>
					<view class="dflex">
						<view class="tag">
							<view class="img-container">
								<image
									src="https://mp-d91ca849-9ed0-4f74-a7da-8583a723969a.cdn.bspapp.com/cloudstorage/94035ef8-26ea-4721-8f72-8fd4b89b3bfa.png">
								</image>
							</view>
							<view>
								<view class="tag_title">总用户数</view>
								<v-countup class="tag_data" :start-value="start" :end-value="23"
									:options="options"></v-countup>
							</view>
						</view>
						<view class="tag">
							<view class="img-container">
								<image
									src="https://mp-d91ca849-9ed0-4f74-a7da-8583a723969a.cdn.bspapp.com/cloudstorage/55a8a4db-0355-43c0-9307-a842afbe90dd.png">
								</image>
							</view>
							<view>
								<view class="tag_title">近7天新增量</view>
								<v-countup class="tag_data" :start-value="start" :end-value="countData.sundayCount"
									:options="options"></v-countup>
							</view>
						</view>
						<view class="tag">
							<view class="img-container">
								<image
									src="https://mp-d91ca849-9ed0-4f74-a7da-8583a723969a.cdn.bspapp.com/cloudstorage/d845e1d9-cf6f-4bd0-aa42-8d3ef9850540.png">
								</image>
							</view>
							<view>
								<view class="tag_title">昨日新增量</view>
								<v-countup class="tag_data" :start-value="start" :end-value="countData.yesTerDayCount"
									:options="options"></v-countup>
							</view>
						</view>
						<view class="tag">
							<view class="img-container">
								<image
									src="https://mp-d91ca849-9ed0-4f74-a7da-8583a723969a.cdn.bspapp.com/cloudstorage/89bb84fd-a639-4576-9729-a6df4cb29278.png">
								</image>
							</view>
							<view>
								<view class="tag_title">今日新增量</view>
								<v-countup class="tag_data" :start-value="start" :end-value="countData.dayAddCount"
									:options="options"></v-countup>
							</view>
						</view>
						<view class="tag">
							<view class="img-container">
								<image
									src="https://mp-d91ca849-9ed0-4f74-a7da-8583a723969a.cdn.bspapp.com/cloudstorage/cc6d7bec-8f12-42e8-b691-ea232f517f96.png">
								</image>
							</view>
							<view>
								<view class="tag_title">今日付款数</view>
								<v-countup class="tag_data" :start-value="start" :end-value="countData.dayPayCount"
									:options="options"></v-countup>
							</view>
						</view>
						<view class="tag">
							<view class="img-container">
								<image
									src="https://mp-d91ca849-9ed0-4f74-a7da-8583a723969a.cdn.bspapp.com/cloudstorage/c08801cf-45ba-489b-b3b7-8f2bee56cd2a.png">
								</image>
							</view>
							<view>
								<view class="tag_title">今日总消费</view>
								<v-countup class="tag_data" :start-value="start" :end-value="countData.sum"
									:options="options"></v-countup>
							</view>
						</view>
					</view>
				</view>
			</el-col>
		</el-row>
		<el-row :gutter="16">
			<el-col :span="5">
				<view class="separate_page stats_area">
					<h3>订单统计</h3>
					<view class="order">
						<view class="dflex">
							<view class="circle_txt">总</view>
							<view>
								<view class="order_title">总单数</view>
								<v-countup class="order_data" :start-value="start" :end-value="countData.count"
									:options="options"></v-countup>
							</view>
						</view>
						<view class="dflex">
							<view class="circle_txt">单</view>
							<view>
								<view class="order_title">客单价</view>
								<v-countup class="order_data" :start-value="start" :end-value="countData.unitPrice"
									:decimals="2" :options="options"></v-countup>
							</view>
						</view>
						<view class="dflex">
							<view class="circle_txt">支</view>
							<view>
								<view class="order_title">支付数</view>
								<v-countup class="order_data" :start-value="start" :end-value="countData.payCount"
									:options="options"></v-countup>
							</view>
						</view>
						<view class="dflex">
							<view class="circle_txt">金</view>
							<view>
								<view class="order_title">付款金额</view>
								<v-countup class="order_data" :start-value="start" :end-value="countData.sumCount"
									:decimals="2" :options="options"></v-countup>
							</view>
						</view>
						<view class="dflex">
							<view class="circle_txt">退</view>
							<view>
								<view class="order_title">退款数</view>
								<v-countup class="order_data" :start-value="start" :end-value="0"
									:options="options"></v-countup>
							</view>
						</view>
					</view>
				</view>
			</el-col>
			<el-col :span="19">
				<view class="separate_page stats_area">
					<view class="dflex_sb">
						<h3>日/月订单数</h3>
						<view>
							<!-- <el-button size="mini" :class="{ active: days == '日' }" @click="day" round>日</el-button>
							<el-button size="mini" :class="{ active: days == '月' }" @click="month" round>月</el-button> -->
							<vk-data-input-date-time v-model="time" type="datetimerange" @change="timeChange($event)"></vk-data-input-date-time>
						</view>
					</view>
					<!-- <view id="create-line-line" class="echart_line_line"></view> -->
					<view class="charts-box">
						<qiun-data-charts type="line" :opts="opts" :chartData="chartData" class="echart_line_line" />
					</view>
				</view>
			</el-col>
		</el-row>
		<el-row :gutter="16">
			<el-col :span="7">
				<view class="separate_page ranking_area">
					<view class="dflex_sb">
						<h3>销量前10排行榜</h3>
						<!-- <el-select size="small" style="width: 100px;" class="state_search" v-model="visit_state_search"
							@change="get_visit_stats">
							<el-option v-for="item in options_state" :key="item.value" :label="item.label"
								:value="item.value"></el-option>
						</el-select> -->
					</view>
					<el-table height="25rem" :data="countData.goodsList" highlight-current-row class="home_table card">
						<el-table-column label="图片">
							<template slot-scope="scope">
								<el-image :src="scope.row.goodsLogo"
									style="width: 75px;border-radius: 10px;"></el-image>
							</template>
						</el-table-column>
						<el-table-column property="goodsName" label="名称" align="center" class="aaa"
							:show-overflow-tooltip="true"></el-table-column>
						<el-table-column property="salesVolume" label="销量" align="center"></el-table-column>
					</el-table>
				</view>
			</el-col>
			<el-col :span="7">
				<view class="separate_page ranking_area">
					<view class="dflex_sb">
						<h3>销量排行榜</h3>
						<!-- <el-select size="small" style="width: 100px;" class="state_search" v-model="browse_state_search"
							@change="get_browse_stats">
							<el-option v-for="item in options_state" :key="item.value" :label="item.label"
								:value="item.value"></el-option>
						</el-select> -->
					</view>
					<el-table height="25rem" :data="countData.goodsList" highlight-current-row class="home_table card">
						<el-table-column label="图片">
							<template slot-scope="scope">
								<swiper class="swiper" circular :indicator-dots="false" :autoplay="true"
									:interval="5000" :duration="2000">
									<swiper-item v-for="(item,index) in scope.row.goodsLogos" :key="index">
										<el-image :src="item"
											style="width: 75px;border-radius: 10px;"></el-image>
									</swiper-item>
								</swiper>
							</template>
						</el-table-column>
						<el-table-column property="goodsName" label="名称" align="center" class="aaa"
							:show-overflow-tooltip="true"></el-table-column>
						<el-table-column property="salesVolume" label="销量" align="center"></el-table-column>
					</el-table>
				</view>
			</el-col>
			<el-col :span="10">
				<view class="separate_page ranking_area">
					<h3>商品销售前10占比</h3>
					<view class="charts-box">
						<qiun-data-charts type="ring" :opts="opt" :chartData="chartDatas" />
					</view>
				</view>
			</el-col>
		</el-row>
		<!-- 页面内容结束 -->
	</view>
</template>

<script>
	import vCountup from 'vue-countupjs';
	var that; // 当前页面对象
	var vk = uni.vk; // vk实例
	export default {
		components: {
			vCountup
		},
		data() {
			// 页面数据变量
			return {
				time: [],
				days: '日',
				tableData_visit: [],
				tableData_browse: [],
				visit_state_search: '全部',
				browse_state_search: '全部',
				options_state: [{
						value: '全部',
						label: '全部'
					},
					{
						value: '待审核',
						label: '待审核'
					},
					{
						value: '销售中',
						label: '销售中'
					},
					{
						value: '已下架',
						label: '已下架'
					}
				],
				value: '',
				start: 0,
				options: {
					useEasing: true, // 缓动动画 easing
					useGrouping: true, // 1,000,000 vs 1000000
					separator: ',', // 数字分隔符
					decimal: '.', // 小数分隔符
					prefix: '', // 前缀
					suffix: '' // 后缀
				},
				chartData: {},
				chartDatas: {},
				opts: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [15, 10, 0, 15],
					dataLabel: false,
					dataPointShape: false,
					enableScroll: false,
					legend: {},
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						gridType: "dash",
						dashLength: 2,
						data: [{
							min: 0,
							max: 70
						}]
					},
					extra: {
						line: {
							type: "curve",
							width: 2,
							activeType: "hollow",
							linearType: "custom",
							onShadow: true,
							animation: "horizontal"
						}
					}
				},
				opt: {
					rotate: false,
					rotateLock: false,
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [5, 5, 5, 5],
					dataLabel: true,
					enableScroll: false,
					legend: {
						show: true,
						position: "right",
						lineHeight: 25
					},
					title: {
						name: "收益率",
						fontSize: 15,
						color: "#666666"
					},
					subtitle: {
						name: "70%",
						fontSize: 25,
						color: "#7cb5ec"
					},
					extra: {
						ring: {
							ringWidth: 60,
							activeOpacity: 0.5,
							activeRadius: 10,
							offsetAngle: 0,
							labelWidth: 15,
							border: true,
							borderWidth: 3,
							borderColor: "#FFFFFF"
						}
					}
				},
				// init请求返回的数据
				data: {

				},
				// 表单请求数据
				form1: {

				},
				countData: {}
			}
		},
		// 监听 - 页面每次【加载时】执行(如：前进)
		onLoad(options = {}) {
			that = this;
			vk = that.vk;
			that.options = options;
			that.init(options);
		},
		// 监听 - 页面【首次渲染完成时】执行。注意如果渲染速度快，会在页面进入动画完成前触发
		onReady() {

		},
		// 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
		onShow() {


		},
		// 监听 - 页面每次【隐藏时】执行(如：返回)
		onHide() {


		},
		// 函数
		methods: {
			// 页面数据初始化函数
			init(options) {
				let { startTime, endTime } = vk.pubfn.getYearOffsetStartAndEnd(0);
				this.time = [startTime, endTime]
				this.getServerData();
				this.get_visit_stats();
				this.get_browse_stats();
				this.getServerDatas();
				this.analysis();
			},
			// 页面跳转
			pageTo(path) {
				vk.navigateTo(path);
			},
			timeChange(e){
				console.log(e)
				this.getServerData()
			},
			day() {
				this.days = '日';
			},
			month() {
				this.days = '月';
			},
			analysis() {
				vk.callFunction({
					url: 'admin/object/pub.home.analysis',
					title: '加载中...'
				}).then((data) => {
					this.countData = data
				}).catch((err) => {

				});
			},
			getServerDatas() {
				vk.callFunction({
					url: 'admin/object/pub.home.test',
					title: '加载中...'
				}).then((data) => {
					let res = {
						series: [{
							data: data.info
						}]
					};
					this.chartDatas = JSON.parse(JSON.stringify(res));
				}).catch((err) => {

				});
			},
			getServerData() {
				vk.callFunction({
					url: 'admin/object/pub.home.lineChart',
					title: '加载中...',
					data:{
						time: this.time
					}
				}).then((data) => {
					let res = {
						categories: data.month,
						series: [{
								name: "订单数",
								linearColor: [
									[
										0,
										"#1890FF"
									],
									[
										0.25,
										"#00B5FF"
									],
									[
										0.5,
										"#00D1ED"
									],
									[
										0.75,
										"#00E6BB"
									],
									[
										1,
										"#90F489"
									]
								],
								setShadow: [
									3,
									8,
									10,
									"#1890FF"
								],
								data: data.counts
							},
						]
					};
					this.chartData = JSON.parse(JSON.stringify(res));
				}).catch((err) => {

				});
				setTimeout(() => {
					//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接

				}, 500);
			},
			get_visit_stats() {
				const res = {
					code: 200,
					msg: '',
					datas: [{
							goods_id: 1057,
							name: 'Huawei/华为Mate30 全网通5G智能手机',
							state: '销售中',
							visit: 32,
							browse: 101.0
						},
						{
							goods_id: 1061,
							name: '无耳洞耳夹OL多圈925银针耳钉简约时尚耳饰品',
							state: '销售中',
							visit: 31,
							browse: 247.0
						},
						{
							goods_id: 1042,
							name: '上衣衬衫女',
							state: '销售中',
							visit: 24,
							browse: 97.0
						},
						{
							goods_id: 1037,
							name: '小米电视',
							state: '销售中',
							visit: 24,
							browse: 92.0
						},
						{
							goods_id: 1046,
							name: '361°篮球鞋',
							state: '销售中',
							visit: 24,
							browse: 126.0
						},
						{
							goods_id: 1035,
							name: '三星冰箱',
							state: '销售中',
							visit: 24,
							browse: 114.0
						},
						{
							goods_id: 1055,
							name: '361男鞋运动鞋',
							state: '销售中',
							visit: 21,
							browse: 41.0
						},
						{
							goods_id: 1050,
							name: '华为荣耀20',
							state: '销售中',
							visit: 19,
							browse: 131.0
						},
						{
							goods_id: 1054,
							name: '耐克男子运动鞋',
							state: '销售中',
							visit: 18,
							browse: 49.0
						},
						{
							goods_id: 1045,
							name: 'Nike男鞋',
							state: '销售中',
							visit: 17,
							browse: 36.0
						},
						{
							goods_id: 1041,
							name: 'iPhone 11 Pro Max',
							state: '销售中',
							visit: 14,
							browse: 68.0
						},
						{
							goods_id: 1059,
							name: '小包包女新款潮2020法国小众质感高级感洋气小ck小香风链条斜挎包 ',
							state: '销售中',
							visit: 14,
							browse: 24.0
						},
						{
							goods_id: 1058,
							name: '鲶鱼包小CK女包2020新款春夏手提包真皮翅膀包结婚新娘包',
							state: '已下架',
							visit: 14,
							browse: 67.0
						},
						{
							goods_id: 1060,
							name: '阿吉豆耳钉女日韩可爱甜美气质猫咪耳环人造猫眼石文艺钩坠耳饰品 ',
							state: '销售中',
							visit: 14,
							browse: 54.0
						},
						{
							goods_id: 1039,
							name: '华为折叠手机',
							state: '销售中',
							visit: 14,
							browse: 116.0
						},
						{
							goods_id: 1043,
							name: '休闲裤',
							state: '已下架',
							visit: 12,
							browse: 20.0
						},
						{
							goods_id: 1053,
							name: '回力帆布小白鞋',
							state: '销售中',
							visit: 11,
							browse: 19.0
						},
						{
							goods_id: 1040,
							name: '小米10',
							state: '销售中',
							visit: 11,
							browse: 28.0
						},
						{
							goods_id: 1051,
							name: '黑鲨游戏手机',
							state: '销售中',
							visit: 11,
							browse: 69.0
						},
						{
							goods_id: 1056,
							name: '富士X-T200相机',
							state: '已下架',
							visit: 9,
							browse: 26.0
						}
					]
				};
				if (res.code == 200) {
					this.tableData_visit = res.datas;
				}
			},
			get_browse_stats() {
				const res = {
					code: 200,
					msg: '',
					datas: [{
							goods_id: 1061,
							name: '无耳洞耳夹OL多圈925银针耳钉简约时尚耳饰品',
							state: '销售中',
							visit: 31,
							browse: 247.0
						},
						{
							goods_id: 1050,
							name: '华为荣耀20',
							state: '销售中',
							visit: 19,
							browse: 131.0
						},
						{
							goods_id: 1046,
							name: '361°篮球鞋',
							state: '销售中',
							visit: 24,
							browse: 126.0
						},
						{
							goods_id: 1039,
							name: '华为折叠手机',
							state: '销售中',
							visit: 14,
							browse: 116.0
						},
						{
							goods_id: 1035,
							name: '三星冰箱',
							state: '销售中',
							visit: 24,
							browse: 114.0
						},
						{
							goods_id: 1057,
							name: 'Huawei/华为Mate30 全网通5G智能手机',
							state: '销售中',
							visit: 32,
							browse: 101.0
						},
						{
							goods_id: 1042,
							name: '上衣衬衫女',
							state: '销售中',
							visit: 24,
							browse: 97.0
						},
						{
							goods_id: 1037,
							name: '小米电视',
							state: '销售中',
							visit: 24,
							browse: 92.0
						},
						{
							goods_id: 1051,
							name: '黑鲨游戏手机',
							state: '销售中',
							visit: 11,
							browse: 69.0
						},
						{
							goods_id: 1041,
							name: 'iPhone 11 Pro Max',
							state: '销售中',
							visit: 14,
							browse: 68.0
						},
						{
							goods_id: 1058,
							name: '鲶鱼包小CK女包2020新款春夏手提包真皮翅膀包结婚新娘包',
							state: '已下架',
							visit: 14,
							browse: 67.0
						},
						{
							goods_id: 1060,
							name: '阿吉豆耳钉女日韩可爱甜美气质猫咪耳环人造猫眼石文艺钩坠耳饰品 ',
							state: '销售中',
							visit: 14,
							browse: 54.0
						},
						{
							goods_id: 1054,
							name: '耐克男子运动鞋',
							state: '销售中',
							visit: 18,
							browse: 49.0
						},
						{
							goods_id: 1055,
							name: '361男鞋运动鞋',
							state: '销售中',
							visit: 21,
							browse: 41.0
						},
						{
							goods_id: 1045,
							name: 'Nike男鞋',
							state: '销售中',
							visit: 17,
							browse: 36.0
						},
						{
							goods_id: 1040,
							name: '小米10',
							state: '销售中',
							visit: 11,
							browse: 28.0
						},
						{
							goods_id: 1056,
							name: '富士X-T200相机',
							state: '已下架',
							visit: 9,
							browse: 26.0
						},
						{
							goods_id: 1059,
							name: '小包包女新款潮2020法国小众质感高级感洋气小ck小香风链条斜挎包 ',
							state: '销售中',
							visit: 14,
							browse: 24.0
						},
						{
							goods_id: 1044,
							name: '回力手绘鞋鲸鱼',
							state: '销售中',
							visit: 8,
							browse: 22.0
						},
						{
							goods_id: 1043,
							name: '休闲裤',
							state: '已下架',
							visit: 12,
							browse: 20.0
						}
					]
				};

				if (res.code == 200) {
					this.tableData_browse = res.datas;
				}
			},
		},
		// 过滤器
		filters: {

		},
		// 计算属性
		computed: {

		}
	}
</script>
<style lang="scss" scoped>
	.page-body {
		// height: 85vh;
		background: #e9e9e9;
	}

	.swiper {
		height: 75px;
	}

	.active {
		color: #fff;
		background-color: #ff6a6c;
		border-color: #ff6a6c;
	}

	.charts-box {
		width: 100%;
		height: 100%;
	}

	.dflex_sb {
		display: flex;
		justify-content: space-between;
	}

	h3 {
		// margin-left: 12px;
		font-weight: 500;
		font-size: 20px;
		user-select: none;
	}

	.separate_page {
		background-color: #fff;
		margin-bottom: 16px;
		padding: 30px;
		border-radius: 10px;
	}

	.tag {
		margin-top: 2.1875rem;
		width: 15rem;
		height: 6.25rem;
		background-color: #7d6aff;
		border-radius: 0.625rem;
		margin-right: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 0.625rem;
		margin-top: 16px;

		.img-container {
			position: relative;
			width: 40px;
			height: 40px;
			// overflow: hidden;
			/* 防止图片放大后溢出 */
			margin-right: 30px;
			color: #fff;

			image {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				transition: transform 0.5s ease-out;
				/* 定义过渡动画效果 */
			}
		}
	}

	.tag:hover image {
		transform: scale(1.2);
	}

	.tag:nth-child(2) {
		background-color: #ffa66a;
	}

	.tag:nth-child(3) {
		background-color: #ff6b6b;
	}

	.tag:nth-child(4) {
		background-color: #69b5ff;
	}

	.tag:nth-child(5) {
		background-color: #b96bff;
	}

	.tag:nth-child(6) {
		background-color: #e9c52b;
	}

	// .tag image {
	// 	margin-right: 14px;
	// 	color: #fff;
	// 	width: 40px;
	// 	height: 40px;
	// }

	// .tag i {
	// 	font-size: 2.1875rem;
	// 	margin-right: 1.5625rem;
	// 	color: #fff;
	// }

	.tag_title {
		font-size: 0.875rem;
		color: #fff;
	}

	.tag_data {
		font-size: 1.5625rem;
		font-weight: 400;
		color: #fff;
	}

	.order {
		padding-top: 2rem;
	}

	.stats_area {
		height: 38rem;
		overflow: hidden;
	}

	.card {
		margin-top: 1rem;
	}

	.circle_txt {
		font-size: 1.25rem;
		text-align: center;
		line-height: 55px;
		margin-bottom: 40px;
		color: #fff;
		margin-right: 20px;
		margin-left: 35px;
		width: 55px;
		height: 55px;
		border-radius: 50%;
		background-color: #ff6b6b;
		transition: transform 0.5s ease-out;
	}

	.dflex:hover .circle_txt {
		// width: 70px;
		// height: 70px;
		// line-height: 70px;
		// margin-bottom: 30px;
		// margin-right: 15px;
		// margin-left: 30px;
		transform: scale(1.2);
		/* 定义过渡动画效果 */
	}

	.dflex {
		display: flex;
		position: relative;
	}

	.dflex:nth-child(2) .circle_txt {
		background-color: #7e6aff;
	}

	.dflex:nth-child(3) .circle_txt {
		background-color: #69b5ff;
	}

	.dflex:nth-child(4) .circle_txt {
		background-color: #ffa66a;
	}

	.dflex:nth-child(5) .circle_txt {
		margin-bottom: 0rem;
		background-color: #b96bff;
	}

	.order_title {
		font-size: 0.75rem;
		margin-top: 0.5625rem;
	}

	.order_data {
		font-size: 1.25rem;
	}

	.echart_line_line {
		width: 100%;
		height: 34rem;
		padding-top: 2rem;
	}

	.ranking_area {
		height: 32rem;
		overflow: hidden;
	}

	.echart_pie {
		width: 100%;
		height: 30rem;
		padding-top: 2rem;
	}

	.echart_map {
		width: 100%;
		height: 40rem;
		padding-top: 2rem;
	}
</style>
