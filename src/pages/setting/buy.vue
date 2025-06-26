<template>
    <el-card shadow="never" class="border-0" id="list-table">
        <el-tabs v-model="activeName">
            <el-tab-pane label="支付设置" name="first">
                <el-table border class="mt-3" :data="tableData" style="width: 100%">
					<el-table-column align="left" label="支付方式">
						<template #default="{ row }">
							<div class="flex items-center">
                                <el-image style="width: 40px;height: 40px;" class="rounded mr-2" :src="row.src" fit="cover" />
								<div class="flex flex-col">
									<h6>{{row.name}}</h6>
									<small class="flex text-gray-500 mt-1">{{row.desc}}</small>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作" width="150"  v-permission="['setSysSetting,POST']">
						<template #default="{ row }">
							<el-button type="text" size="small" @click="openEdit(row.key)">配置</el-button>
						</template>
					</el-table-column>
				</el-table>
            </el-tab-pane>
            <el-tab-pane label="购物设置" name="second">
                <el-form :model="form" label-width="160px" size="default">
					<el-form-item label="未支付订单">
						<div>
                            <el-input type="number" style="width: 250px;" placeholder="未支付订单" v-model="form.close_order_minute">
                                <template #append>分钟后自动关闭</template>
                            </el-input>
                            <small class="text-gray-500 flex mt-1">订单下单未付款，n分钟后自动关闭，设置0不自动关闭</small>
                        </div>
					</el-form-item>
					<el-form-item label="已发货订单">
						<div>
                            <el-input type="number" style="width: 250px;" placeholder="已发货订单" v-model="form.auto_received_day">
                                <template #append>天后自动确认收货</template>
                            </el-input>
                            <small class="text-gray-500 flex mt-1">如果在期间未确认收货，系统自动完成收货，设置0不自动收货</small>
                        </div>
					</el-form-item>
					<el-form-item label="已完成订单">
						<div>
                            <el-input type="number" style="width: 250px;" placeholder="已完成订单" v-model="form.after_sale_day">
                                <template #append>天内允许申请售后</template>
                            </el-input>
                            <small class="text-gray-500 flex mt-1">订单完成后 ，用户在n天内可以发起售后申请，设置0不允许申请售后</small>
                        </div>
					</el-form-item>
					<el-form-item v-permission="['setSysSetting,POST']">
						<el-button type="primary" @click="submit">保存</el-button>
					</el-form-item>
				</el-form>
            </el-tab-pane>
        </el-tabs>

        <form-drawer 
        ref="formDrawerRef" 
        title="配置" 
        @submit="submit">
            <el-form v-if="drawerType === 'alipay'" label-width="80px" size="default">
                <el-form-item label="app_id" prop="app_id">
                    <el-input v-model="form.alipay.app_id" placeholder="app_id" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="公钥" prop="ali_public_key">
                    <el-input type="textarea" rows="4" v-model="form.alipay.ali_public_key" placeholder="公钥" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="私钥">
                    <el-input type="textarea" rows="4" v-model="form.alipay.private_key" placeholder="公钥" style="width: 90%;"></el-input>
                </el-form-item>
            </el-form>

            <el-form v-if="drawerType === 'wxpay'" :model="form" label-width="100px" size="default">
                <el-form-item label="公众号 APPID">
                    <el-input v-model="form.wxpay.app_id" style="width: 50%;" placeholder="公众号 APPID"></el-input>
                </el-form-item>
                <el-form-item label="小程序 APPID">
                    <el-input v-model="form.wxpay.miniapp_id" style="width: 50%;" placeholder="小程序 APPID"></el-input>
                </el-form-item>
                <el-form-item label="小程序 secret">
                    <el-input v-model="form.wxpay.secret" style="width: 50%;" placeholder="小程序 secret"></el-input>
                </el-form-item>
                <el-form-item label="appid">
                    <el-input v-model="form.wxpay.appid" style="width: 50%;" placeholder="appid"></el-input>
                </el-form-item>
                <el-form-item label="商户号">
                    <el-input v-model="form.wxpay.mch_id" style="width: 50%;" placeholder="商户号"></el-input>
                </el-form-item>
                <el-form-item label="API 密钥">
                    <el-input v-model="form.wxpay.key" placeholder="API 密钥"></el-input>
                </el-form-item>
                <el-form-item label="cert_client">
                    <el-upload 
                    action="/admin/sysconfig/upload" 
                    :limit="1" 
                    :headers="{ token:$store.state.token }" 
                    accept=".pem"
                    :on-success="uploadClientSuccess">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <template #tip>
                            <p class="text-rose-500">{{form.wxpay.cert_client ? form.wxpay.cert_client : '还未配置'}}</p>
                            <small class="text-gray-500 flex">例如：apiclient_cert.pem</small>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="cert_key">
                    <el-upload 
                    action="/admin/sysconfig/upload" 
                    :limit="1" 
                    :headers="{ token:$store.state.user.token }" 
                    accept=".pem"
                    :on-success="uploadKeySuccess">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <template #tip>
                            <p class="text-rose-500">{{form.wxpay.cert_key ? form.wxpay.cert_key : '还未配置'}}</p>
                            <small class="text-gray-500 flex">apiclient_key.pem</small>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
        </form-drawer>

    </el-card>
</template>
<script setup>
    import { ref,reactive,onMounted } from 'vue'
    import FormDrawer from '~/components/FormDrawer.vue'
    import { showLoading,hideLoading,toast } from '~/composables/util'
    import { 
        getSysconfig,
        setSysconfig,
    } from '~/api/sysconfig'

    const activeName = ref("first")
    const tableData = ref([{
        name: "支付宝支付",
        key: "alipay",
        desc: "该系统支持即时到账接口",
        src: "/alipay.png"
    }, {
        name: "微信支付",
        key: "wxpay",
        desc: "该系统支持微信网页支付和扫码支付",
        src: "/wepay.png"
    }])
    const form = reactive({
        close_order_minute: 0,
        auto_received_day: 0,
        after_sale_day: 0,
        alipay: {
            app_id: "",
            ali_public_key: "",
            private_key: ""
        },
        wxpay: {
            app_id: '', // 公众号 APPID 
            miniapp_id: '', // 小程序 APPID 
            secret: "", // 小程序secret 
            appid: '', // appid 
            mch_id: '', // 商户号 
            key: '', // API 密钥 
            cert_client: '',
            cert_key: '',
        }
    })

    function getData(){
        showLoading()
        getSysconfig().then(d=>{
            for (const k in form) {
                form[k] = d[k]
            }
        }).finally(()=>{
            hideLoading()
        })
    }

    onMounted(()=>getData())

    const submit = ()=>{
        showLoading()
        setSysconfig(form).then(res=>{
            toast("修改成功")
            getData()
        }).finally(()=>{
            hideLoading()
        })
    }


    const formDrawerRef = ref(null)
    const drawerType = ref("alipay")

    const openEdit = (key)=>{
        drawerType.value = key
        formDrawerRef.value.open()
    }

    const uploadClientSuccess = (response, file, fileList)=>{
        form.wxpay.cert_client = response.data
    }
    const uploadKeySuccess = (response, file, fileList)=>{
        form.wxpay.cert_key = response.data
    }

</script>