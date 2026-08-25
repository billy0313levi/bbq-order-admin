<template>
	<view class="page">
		<!-- 页面头部内容开始 -->
		<vk-data-page-header :title="page.title" show-back @back="pageBack"></vk-data-page-header>
		<!-- 页面头部内容结束 -->
		<view class="page-body">
			<!-- 页面主体内容开始  max-height="inherit"-->
			<vk-data-form ref="form1" v-model="form1" :rules="formData1.rules" :action="formData1.action"
				:form-type="formData1.formType" :columns='formData1.columns' label-width="140px"
				max-height="calc(100vh - 210px)" :footer-show="false" :loading.sync="formData1.loading"
				:before-action="formData1.beforeAction" @success="formSuccess">

				<!-- 优惠规则 -->
				<template v-slot:coupon_rule="{ form, keyName }">
					<view style="margin-left: 60px;">
						<view style="color: #606266;" v-if="form.type === 1">
							<text>优惠力度：</text>
							<text>满</text>
							<text style="margin-left: 10px;"><vk-data-input-money v-model="form[keyName].min_amount"
									:precision="0" width="140px" :clearable="false" placeholder="多少" rightText="元"
									:disabled="options.mode === 'update'" /></text>
							<text style="margin-left: 10px;">，减</text>
							<text style="margin-left: 10px;"><vk-data-input-money
									v-model="form[keyName].discount_amount" :precision="0" width="140px"
									:clearable="false" placeholder="多少" rightText="元"
									:disabled="options.mode === 'update'" /></text>
						</view>
						<view style="color: #606266;" v-else-if="form.type === 2">
							<text>折扣力度：</text>
							<text style="margin-left: 10px;"><vk-data-input-discount
									v-model="form[keyName].discount_proportion" :precision="0" width="140px"
									:clearable="false" placeholder="多少" rightText="折"
									:disabled="options.mode === 'update'" /></text>
						</view>
					</view>

				</template>


				<!-- 有效期 -->
				<template v-slot:effective_time_rule="{ form, keyName }">
					<view style="color: #606266;">
						<view @click="form[keyName].type=0">
							<el-radio v-model="form[keyName].type" :label="0" style="width: 80px;">固定时间：</el-radio>
							<vk-data-input-date-time v-model="form[keyName].start_fixed_time" type="datetime"
								:disabled="form[keyName].type != 0" />
							<text style="margin: 0 5px;">-</text>
							<vk-data-input-date-time v-model="form[keyName].end_fixed_time" type="datetime"
								:disabled="form[keyName].type != 0" />
						</view>
						<view style="margin-top: 20px;" @click="form[keyName].type=1">
							<el-radio v-model="form[keyName].type" :label="1" style="width: 80px;">领取：</el-radio>
							<text><vk-data-input-number v-model="form[keyName].start_dynamic_time" :precision="0"
									width="200px" placeholder="请输入天数" rightText="天" :clearable="false"
									:disabled="form[keyName].type != 1" /></text>
							<text style="margin-left: 10px;">生效，有效期</text>
							<text style="margin-left: 10px;"><vk-data-input-number
									v-model="form[keyName].end_dynamic_time" :precision="0" width="200px"
									placeholder="请输入天数" rightText="天" :clearable="false"
									:disabled="form[keyName].type != 1" /></text>
						</view>
					</view>
				</template>

				<!-- 领取限制 -->
				<template v-slot:is_public="{ form, keyName }">
					<view style="color: #606266;">
						<view @click="form[keyName]=true">
							<el-radio v-model="form[keyName]" :label="true" style="width: 80px;">限领：</el-radio>
							<text><vk-data-input-number v-model="form.limit" :precision="0" width="150px" placeholder=""
									rightText="张" :clearable="false" :disabled="form[keyName] != true" /></text>
							<text style="margin-left: 10px;color: #9FA5BB;">填0或不填代表不限制（商家赠送，营销活动赠送不受此限制）</text>
						</view>
						<view style="margin-top: 20px;" @click="form[keyName]=false">
							<el-radio v-model="form[keyName]" :label="false" style="width: 80px;">不可自主领取：</el-radio>
							<text style="margin-left: 10px;color: #9FA5BB;">选择后将不展示在优惠券列表中，只能通过商家后台发放</text>
						</view>
					</view>
				</template>
			</vk-data-form>
			<!-- 页面主体内容结束 -->
		</view>
		<view class="page-footer">
			<!-- 页面底部内容开始 -->
			<el-button :loading="formData1.loading" type="primary" style="width: 80px;"
				@click="submitForm">{{ page.submitText }}</el-button>
			<el-button plain style="margin-left: 20px;width: 80px;" @click="pageBack">返回</el-button>
			<!-- 页面底部内容开始 -->
		</view>
		<view class="page-dialog">
			<!-- 页面弹窗内容开始 -->

			<!-- 页面弹窗内容开始 -->
		</view>
	</view>
</template>

<script>
	var that; // 当前页面对象
	var vk = uni.vk; // vk实例
	var originalForms = {}; // 表单初始化数据
	// action路径目录
	const pageName = "优惠券";
	var defaultFormData = {
		status: 1,
		type: 1,
		is_public: true,
		coupon_rule: {
			type: 0,
			min_amount: "",
			discount_amount: "",
			discount_proportion: "",
			describe: "",
		},
		effective_time_rule: {
			type: 0,
			start_fixed_time: "",
			end_fixed_time: "",
			start_dynamic_time: "",
			end_dynamic_time: "",
		},
	};
	export default {
		data() {
			// 页面数据变量
			return {
				// 页面配置数据
				page: {
					title: "",
					submitText: "",
				},
				// 表单请求数据
				form1: {
					...defaultFormData
				},
				formData1: {
					// 表单请求地址
					action: "admin/object/sys.coupon.addUpdate",
					// 表单字段显示规则
					columns: [{
							key: "",
							title: "基础信息",
							type: "bar-title"
						},
						{
							key: "status",
							title: "优惠券状态",
							type: "radio",
							optionType: "button",
							data: [{
									value: 0,
									label: "下架"
								},
								{
									value: 1,
									label: "上架"
								}
							],
							tips: "优惠券下架不影响已发放的优惠券的使用"
						},
						{
							key: "name",
							title: "优惠券标题",
							type: "text",
							width: 400,
							maxlength: 20,
							showWordLimit: true,
							tips: "建议填写“10元代金券”、“8折券”等易于理解的具体优惠内容，限20个字以内"
						},
						{
							key: "stock",
							title: "库存（张）",
							type: "number",
							width: 220,
							rightText: "张"
						},
						{
							key: "is_public",
							title: "领取限制",
							type: "switch",
							width: 100,
							activeValue: true,
							inactiveValue: false
						},
						{
							key: "",
							title: "优惠券类型",
							type: "bar-title"
						},
						{
							key: "type",
							title: "优惠券类型",
							type: "radio",
							itemWidth: 100,
							data: [{
									value: 1,
									label: "满减券"
								}, // 已支持
								{
									value: 2,
									label: "折扣券"
								}, // 已支持
							],
							disabled: () => {
								return this.options.mode === "update";
							}
						},
						{
							key: "coupon_rule",
							title: "优惠规则",
							type: "text",
							width: 100,
							showLabel: false,
							disabled: () => {
								return this.options.mode === "update";
							}
						},
						{
							key: "",
							title: "领取时间",
							type: "bar-title"
						},
						{
							key: "receive_start_time",
							title: "最早可领取时间",
							type: "date",
							dateType: "datetime",
							width: 220
						},
						{
							key: "receive_end_time",
							title: "最晚可领取时间",
							type: "date",
							dateType: "datetime",
							width: 220
						},
						{
							key: "",
							title: "有效期",
							type: "bar-title"
						},
						{
							key: "effective_time_rule",
							title: "有效期",
							type: "text"
						}, // 插槽实现
						{
							key: "describe",
							title: "使用说明",
							type: "textarea",
							width: 600,
							autosize: {
								minRows: 4,
								maxRows: 10
							},
							maxlength: 200,
							showWordLimit: true,
						},
					],
					// 表单验证规则
					rules: {
						name: [
							// 必填
							{
								required: true,
								message: "优惠券标题不能为空",
								trigger: ['blur', 'change']
							}
						],
						stock: [
							// 必填
							{
								type: "number",
								min: 0,
								required: true,
								message: "优惠券库存必须>0",
								trigger: ['blur', 'change']
							}
						],
						type: [
							// 必填
							{
								type: "number",
								required: true,
								message: "优惠券类型不可为空",
								trigger: ['blur', 'change']
							}
						],
						"coupon_rule": [
							// 自定义
							{
								validator: (rule, value, callback) => {
									let {
										form1 = {}
									} = this;
									if (form1.type === 1) {
										if (value.discount_amount <= 0) {
											callback(new Error('优惠金额错误，必须>0'));
										}
									} else if (form1.type === 2) {
										if (value.discount_proportion <= 0 || value.discount_proportion >= 1) {
											callback(new Error('折扣错误，必须在0折和10折之间'));
										}
									}
									callback();
								},
								trigger: ['blur', 'change']
							}
						],
					},
					// add 代表添加 update 代表修改
					formType: '',
					// 是否显示表单1 的弹窗
					show: false,
					// 表单是否请求中
					loading: false,
				}
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
		onReady() {},
		// 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
		onShow() {},
		// 监听 - 页面每次【隐藏时】执行(如：返回)
		onHide() {},
		// 函数
		methods: {
			// 页面数据初始化函数
			init(options) {
				if (options.mode === "update") {
					that.page.title = pageName + "编辑";
					that.page.submitText = "修改";
					vk.callFunction({
						url: "admin/object/sys.coupon.findCouponById",
						title: '请求中...',
						data: {
							_id: options._id
						},
						success: function(data) {
							let formData = vk.pubfn.copyObject(defaultFormData);
							that.form1 = vk.pubfn.objectAssign(formData, data.info);
							originalForms["form1"] = vk.pubfn.copyObject(that.form1);
						}
					});
				} else {
					that.page.title = pageName + "添加";
					that.page.submitText = "添加";
					originalForms["form1"] = vk.pubfn.copyObject(defaultFormData);
					const eventChannel = this.getOpenerEventChannel();
					// 监听data事件，获取上一页面通过eventChannel.emit传送到当前页面的数据
					if (eventChannel.on) {
						eventChannel.on('data', (data) => {
							let formData = vk.pubfn.copyObject(defaultFormData);
							that.form1 = vk.pubfn.objectAssign(formData, data);
							originalForms["form1"] = vk.pubfn.copyObject(that.form1);
						});
					}
				}
			},
			// 页面跳转
			pageTo(path) {
				vk.navigateTo(path);
			},
			// 页面返回
			pageBack() {
				const pages = getCurrentPages();
				if (pages.length > 1 && pages[0].route !== that.$page.route) {
					vk.navigateBack();
				} else {
					vk.navigateTo('coupon');
				}
			},
			// 表单重置
			resetForm() {
				vk.pubfn.resetForm(originalForms, that);
			},
			// 表单提交
			submitForm() {
				that.form1.mode = that.options.mode;
				that.$refs.form1.submitForm();
			},
			formSuccess(res) {
				that.$alert(res.data.msg, '提示', {
					confirmButtonText: '确定',
					callback: action => {
						vk.navigateTo("coupon");
					}
				});
			}
		},
		// 监听属性
		watch: {

		},
		// 计算属性
		computed: {

		}
	}
</script>
<style lang="scss" scoped>
	.page {}
</style>