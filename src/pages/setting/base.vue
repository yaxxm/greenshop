<template>
    <el-card shadow="never" class="border-0" id="list-table">
        <el-form :model="form" size="default" label-width="160px">
            <el-tabs v-model="activeName">
                <el-tab-pane label="注册与访问" name="first">
                    <el-form-item label="是否允许注册会员" prop="open_reg">
                        <el-radio-group v-model="form.open_reg">
                            <el-radio :label="1" border class="mr-1">是</el-radio>
                            <el-radio :label="0" border class="mr-1">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="注册类型">
                        <el-radio-group v-model="form.reg_method">
                            <el-radio label="username" border class="mr-1">普通注册</el-radio>
                            <el-radio label="phone" border class="mr-1">手机注册</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="密码最小长度">
                        <el-input v-model="form.password_min" type="number" style="width: 30%;" placeholder="密码最小长度"></el-input>
                    </el-form-item>
                    <el-form-item label="强制密码复杂度">
                        <el-checkbox-group v-model="form.password_encrypt">
                            <el-checkbox label="0" border class="mr-1">数字</el-checkbox>
                            <el-checkbox label="1" border class="mr-1">小写字母</el-checkbox>
                            <el-checkbox label="2" border class="mr-1">大写字母</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="上传设置" name="second">
                    <el-form-item label="默认上传方式">
                        <el-radio-group v-model="form.upload_method">
                            <el-radio label="oss" border class="mr-1">阿里oss</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <template v-if="form.upload_method === 'oss'">
                        <el-form-item label="Bucket">
                            <el-input v-model="form.upload_config.Bucket" style="width: 30%;" placeholder="Bucket"></el-input>
                        </el-form-item>
                        <el-form-item label="ACCESS_KEY">
                            <el-input v-model="form.upload_config.ACCESS_KEY" style="width: 30%;" placeholder="ACCESS_KEY"></el-input>
                        </el-form-item>
                        <el-form-item label="SECRET_KEY">
                            <el-input v-model="form.upload_config.SECRET_KEY" style="width: 30%;" placeholder="SECRET_KEY"></el-input>
                        </el-form-item>
                        <el-form-item label="空间域名">
                            <el-input v-model="form.upload_config.http" style="width: 30%;" placeholder="http"></el-input>
                            <small class="text-gray-500 flex mt-1">请补全http:// 或 https://</small>
                        </el-form-item>
                    </template>
                </el-tab-pane>
                <el-tab-pane label="Api安全" name="third">
                    <el-form-item label="是否开启API安全">
                        <el-radio-group v-model="form.api_safe">
                            <el-radio :label="1" border class="mr-1">是</el-radio>
                            <el-radio :label="0" border class="mr-1">否</el-radio>
                        </el-radio-group>
                        <small class="text-gray-500 flex mt-1">api安全功能开启之后调用前端api需要传输签名串</small>
                    </el-form-item>
                    <el-form-item label="秘钥">
                        <el-input v-model="form.api_secret" style="width: 50%;" placeholder="秘钥"></el-input>
                        <small class="text-gray-500 flex mt-1">秘钥设置关系系统中api调用传输签名串的编码规则，以及会员token解析，请慎重设置，注意设置之后对应会员要求重新登录获取token</small>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
            <el-form-item v-permission="['setSysSetting,POST']">
                <el-button type="primary" size="small" @click="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script setup>
    import { ref,reactive,onMounted } from 'vue'
    import { showLoading,hideLoading,toast } from '~/composables/util'
    import { 
        getSysconfig,
        setSysconfig,
    } from '~/api/sysconfig'

    const activeName = ref("first")
    const form = reactive({
        open_reg:1,
        reg_method:"username",
        password_min:"",
        password_encrypt:["0"],
        upload_method:"oss",
        upload_config:{ 
            Bucket:"", 
            ACCESS_KEY:"", 
            SECRET_KEY:"", 
            http:"",
        },
        api_safe:1,
        api_secret:""
    })

    function getData(){
        showLoading()
        getSysconfig().then(d=>{
            for (const k in form) {
                form[k] = d[k]
            }
			form.password_encrypt = form.password_encrypt.split(',')
        }).finally(()=>{
            hideLoading()
        })
    }

    onMounted(()=>getData())

    const submit = ()=>{
        showLoading()
        form.password_encrypt = form.password_encrypt.join(',')
        setSysconfig(form).then(res=>{
            toast("修改成功")
            getData()
        }).finally(()=>{
            hideLoading()
        })
    }
</script>