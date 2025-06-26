<template>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 | 高级搜索 -->
        <el-form :model="form" size="small" label-width="80px" class="mb-3">
            <el-row :gutter="20">
                <el-col :span="8" :offset="0">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username" placeholder="请输入用户名" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="0">
                    <el-form-item label="性别" prop="sex">
                        <el-select clearable v-model="form.sex" placeholder="请选择性别">
                            <el-option label="男" value="boy"></el-option>
                            <el-option label="女" value="girl"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <template v-if="showSearch">
                    <el-col :span="8" :offset="0">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item label="状态" prop="status">
                            <el-select clearable v-model="form.status" placeholder="请选择状态">
                                <el-option label="禁用" value="0"></el-option>
                                <el-option label="启用" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <el-form-item label="创建时间" prop="created_time">
                            <el-date-picker
                                v-model="form.created_time"
                                type="datetime"
                                placeholder="请选择创建时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </template>

                <el-col :span="8" :offset="0" >
                    <div class="flex items-center justify-end">
                        <el-button type="primary">搜索</el-button>
                        <el-button @click="resetForm">重置</el-button>
                        <el-button type="text" @click="showSearch = !showSearch">
                            {{ showSearch ? "收起" : "展开" }}
                            <el-icon class="ml-1">
                                <component :is="showSearch ? 'arrow-up-bold' : 'arrow-down-bold'"></component>
                            </el-icon>
                        </el-button>
                        
                    </div>
                </el-col>
            </el-row>
        </el-form>
        <!-- 新增,批量删除 | 刷新,列设置,导出 -->
        <div class="flex items-center mb-4">
            <el-button type="primary" size="small">新增</el-button>
            <el-button type="danger" size="small">批量删除</el-button>

            <div class="ml-auto">
                <el-tooltip effect="dark" content="刷新数据" placement="top">
                    <el-link class="px-2">
                        <el-icon size="20"><refresh /></el-icon>
                    </el-link>
                </el-tooltip>
                <el-tooltip effect="dark" content="导出数据" placement="top">
                    <el-link class="px-2">
                        <el-icon size="20"><download /></el-icon>
                    </el-link>
                </el-tooltip>
            </div>
        </div>

        <!-- 表格 -->
        <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="tableData" style="width: 100%" stripe>
            <el-table-column fixed="left" type="selection" width="55" />
            <el-table-column prop="date" label="时间" width="150" />
            <el-table-column prop="name" label="名字" width="120" />
            <el-table-column prop="state" label="地区" width="120" />
            <el-table-column prop="city" label="城市" width="120" />
            <el-table-column prop="address" label="地址" width="600" />
            <el-table-column prop="zip" label="邮编" width="120" />
            <el-table-column fixed="right" label="操作" width="120">
                <template #default>
                    <el-button type="text" size="small">详情</el-button
                    >
                    <el-button type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="mt-5 flex justify-center">
            <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" @current-change="handlePageChange"></el-pagination>
        </div>

    </el-card>
</template>
<script setup>
    import { ref,reactive } from 'vue'
    const showSearch = ref(false)
    const form = reactive({
        username:"",
        sex:"",
        email:"",
        status:"",
        created_time:""
    })
    // 重置表单
    const resetForm = ()=>{
        form.username = ""
        form.sex = ""
    }

    const tableData = ref([
        {
          date: '2016-05-03',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
          tag: 'Home',
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
          tag: 'Office',
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
          tag: 'Home',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
          tag: 'Office',
        },
      ])


    // 多选处理
    const multipleSelection = ref([])
    const handleSelectionChange = (val)=> {
      multipleSelection.value = val
    }

    // 分页
    const limit = ref(20)
    const total = ref(1000)

    const handlePageChange = (page)=>{
        console.log(page)
    }
    
</script>