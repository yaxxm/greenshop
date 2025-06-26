<template>
	<el-card shadow="never" class="border-0" :body-style="{ padding:0 }">
        <template #header>
			<div class="flex justify-between">
				<span class="text-sm">订单统计</span>
				<div>
                    <el-check-tag :checked="current == item.value" style="margin-right: 8px" v-for="(item,index) in options" :key="index" @click="handleChoose(item.value)">{{ item.text }}</el-check-tag>
				</div>
			</div>
		</template>
		<div id="chart" style="width: 100%;height: 300px;"></div>
    </el-card>
</template>

<script setup>
	import * as echarts from 'echarts';
    import { ref,onMounted,onBeforeUnmount  } from 'vue'
    import {
        getStatistics3
    } from '~/api/index.js'

    const current = ref("week")
    const options = ref([{
        text: "近1个月",
        value: "month"
    }, {
        text: "近1周",
        value: "week"
    }, {
        text: "近24小时",
        value:"hour"
    }])

    let myChart = null

    onMounted(()=>{
        // 初始化图表
        myChart = echarts.init(document.getElementById('chart'));
        // 获取数据
        getData(current.value)
    })

     // 释放echarts对象，非常重要，没有释放的话，打包之后会出现白屏现象
     onBeforeUnmount(()=>{
         if (myChart) {
             echarts.dispose(myChart)
         }
     })


    let chartData = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: [{
            type: 'value'
        }],
        series: [{
            data:[],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
            }
        }]
    }

    function getData(type = "month"){
        myChart.showLoading();

        getStatistics3(type).then(res=>{
           chartData.xAxis.data = res.x
            chartData.series[0].data = res.y
            myChart.setOption(chartData)
        }).finally(()=>myChart.hideLoading())
    }

    function handleWindowResize(){
        myChart.resize()
    } 

	const handleChoose = (v)=> {
        current.value = v
        getData(v)
    }
</script>

<style>
	.charts-box {
		width: 100%;
		height: 350px;
	}
</style>
