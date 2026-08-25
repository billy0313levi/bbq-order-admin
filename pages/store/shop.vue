<template>
	<view class="page">
		<!-- 页面头部内容开始 -->
		<vk-data-page-header :title="page.title" :show-back="page.showBack" @back="pageBack"></vk-data-page-header>
		<!-- 页面头部内容结束 -->
		<view class="page-body" v-loading="form1.props.loading" style="padding-bottom: 40px;">
			<!-- 页面主体内容开始 -->
			<vk-data-form ref="form1" v-model="form1.data" :rules="form1.props.rules" :action="form1.props.action"
				:form-type="form1.props.formType" :columns='form1.props.columns' :loading.sync="form1.props.loading"
				:labelWidth="form1.props.labelWidth" :footer-show="false" :success-msg="form1.props.successMsg"
				:before-action="form1.props.beforeAction" @success="formSuccess"></vk-data-form>
			<!-- 页面主体内容结束 -->
		</view>
		<view class="page-footer">
			<!-- 页面底部内容开始 -->
			<el-button v-if="page.showBack" plain style="margin-right: 20px;width: 80px;" @click="pageBack"
				:loading="form1.props.loading">{{ page.cancelText }}</el-button>
			<el-button type="primary" style="width: 80px;" @click="submitForm" :loading="form1.props.loading">
				{{ page.submitText }}
			</el-button>
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
	export default {
		data() {
			// 页面数据变量
			return {
				// init请求返回的数据
				data: {

				},
				page: {
					title: "门店配置",
					submitText: "设置",
					cancelText: "返回",
					showBack: false,
					backPage: ""
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
								placeholder: "请输入门店名称",
								width: 400
							},
							{
								key: "storePhone",
								title: "联系电话",
								type: "number",
								width: 400
							},
							{
								key: "storeAddress",
								title: "门店地址",
								type: "address",
								width: 400
							},
							{
								key: "detailedAddress",
								title: "详细地址",
								type: "text",
								placeholder: "请输入详细地址",
								width: 400
							},
							{
								key: "storeProfile",
								title: "门店简介",
								type: "text",
								placeholder: "请输入门店简介",
								width: 400
							},
							{
								key: "message",
								title: "欢迎语",
								type: "text",
								placeholder: "请输入欢迎语",
								width: 400
							},
							{
								key: "packingFee",
								title: "包装费",
								type: "number",
								controls: true,
								width: 400
							},
							{
								key: "distributionFee",
								title: "配送费",
								type: "number",
								controls: true,
								width: 400
							},
							{
								key: "startingPrice",
								title: "起送价",
								type: "number",
								controls: true,
								width: 400
							},
							{
								key: "integral",
								title: "积分",
								type: "number",
								controls: true,
								tips: "每消费几元积一分",
								width: 400
							},
							{
								key: "businessHours",
								title: "营业时间",
								type: "time",
								isRange: true,
								width: 400
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
						rules: {},
						labelWidth: "160px",
						loading: false,
						successMsg: "设置成功",
						// beforeAction: (formData) => {
						// 	// 可在此处修改 formData 后返回 formData，若在此处return false，则表单不触发提交请求。
						// 	return {
						// 		[settingKey]: formData
						// 	};
						// },

					}
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
				that.$nextTick(function() {
					vk.callFunction({
						url: 'admin/object/sys.store.kh_findStoreByUid',
						loading:{ that, name:"form1.props.loading"},
						data: {}
					}).then((data) => {
						console.log(data)
						if(vk.pubfn.isNotNull(data.storeInfo)){
							this.form1.data = data.storeInfo
							this.form1.props.action = 'admin/object/sys.store.edit';
						}else{
							this.form1.data = {}
							this.form1.props.action = 'admin/object/sys.store.add';
						}
						
						// that.initData(data.storeInfo);
					}).catch((err) => {

					});
				});

				// that.$nextTick(function(){
				// 	let mchInfo = vk.getVuex('$user.mchInfo');
				// 	that.initData(mchInfo);
				// 	vk.callFunction({
				// 		url: 'client/pub.getMchInfo',
				// 		loading:{ that, name:"form1.props.loading"},
				// 		data:{

				// 		},
				// 		success:function(data){
				// 			that.initData(data.mchInfo);
				// 			vk.setVuex('$user.mchInfo',data.mchInfo);
				// 		}
				// 	});
				// });
			},
			initData(info) {
				vk.pubfn.objectAssign(this.form1.data, info);
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
				} else if (that.page.backPage) {
					vk.navigateTo(that.page.backPage);
				}
			},
			// 表单重置
			resetForm() {
				that.$refs.form1.resetForm();
			},
			// 表单提交
			submitForm() {
				that.$refs.form1.submitForm();
			},
			formSuccess(res) {}
		},
		// 监听器
		watch: {


		},
		// 计算属性
		computed: {

		}
	}
</script>
<style lang="scss" scoped>

</style>
