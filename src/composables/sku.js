import { reactive, ref, nextTick, watch, computed } from 'vue'

import {
    useArrayMoveUp,
    useArrayMoveDown,
    cartesianProductOf
} from '~/composables/util'

import {
    createGoodsSkusCard,
    updateGoodsSkusCard,
    deleteGoodsSkusCard,
    sortGoodsSkusCard,
    createGoodsSkusCardValue,
    updateGoodsSkusCardValue,
    deleteGoodsSkusCardValue,
    chooseAndSetGoodsSkusCard
} from '~/api/goods'

// 当前商品id
export const goodsId = ref(0)
    // 规格列表
export const sku_card_list = ref([])
export const sku_list = ref([])

// 初始化规格列表
export function initSkuCardList(d) {
    sku_card_list.value = d.goodsSkusCard.map(item => {
        item.text = item.name
        item.loading = item.loading
        item.goodsSkusCardValue.map(v => {
            v.text = item.type === 0 ? v.value : '属性值'
            return v
        })
        return item
    })
    sku_list.value = d.goodsSkus
}

// 添加规格
export const btnLoading = ref(false)
export const addSkuCardEvent = () => {
    btnLoading.value = true
    createGoodsSkusCard({
        goods_id: goodsId.value,
        name: "规格名称",
        order: 50,
        type: 0,
    }).then(res => {
        sku_card_list.value.push({
            ...res,
            text: res.name,
            loading: false,
            goodsSkusCardValue: []
        })
    }).finally(() => btnLoading.value = false)
}

// 修改规格
export const handleUpdate = (item) => {
    item.loading = true
    updateGoodsSkusCard(item.id, {
            goods_id: item.goods_id,
            name: item.text,
            order: 50,
            type: 0
        })
        .then(res => item.name = item.text)
        .catch(err => item.text = item.name)
        .finally(() => item.loading = false)
}

// 删除规格
export const handleDelete = (item) => {
    item.loading = true
    deleteGoodsSkusCard([item.id])
        .then(res => {
            const i = sku_card_list.value.findIndex(o => o.id == item.id)
            sku_card_list.value.splice(i, 1)
            getTableData()
        })
        .catch(err => item.loading = false)
}

// 排序规格
export const bodyLoading = ref(false)
export const sortCard = (action, index) => {
    const func = action == "up" ? useArrayMoveUp : useArrayMoveDown
    let oList = JSON.parse(JSON.stringify(sku_card_list.value))
    func(oList, index)
    bodyLoading.value = true
    sortGoodsSkusCard({
            sortdata: oList.map((item, index) => {
                return {
                    id: item.id,
                    order: index + 1
                }
            })
        })
        .then(res => {
            func(sku_card_list.value, index)
            getTableData()
        })
        .finally(() => bodyLoading.value = false)
}

// 选择设置规格
export const handleChooseSetGoodsSkusCard = (id, data) => {
    let item = sku_card_list.value.find(o => o.id == id)
    if (item) {
        item.loading = true
        chooseAndSetGoodsSkusCard(id, data).then(res => {
            item.text = item.name = res.goods_skus_card.name
            item.goodsSkusCardValue = res.goods_skus_card_value.map(o => {
                o.text = o.value
                return o
            })
            getTableData()
        }).finally(() => item.loading = false)
    }
}

// 初始化规格属性
export function initSkusCardItem(id) {
    const item = sku_card_list.value.find(o => o.id == id)

    const inputVisible = ref(false)
    const inputValue = ref("")
    const saveTagInput = ref(null)

    const loading = ref(false)

    // 删除
    const handleClose = (tag) => {
        loading.value = true
        deleteGoodsSkusCardValue([tag.id]).then(res => {
            let i = item.goodsSkusCardValue.findIndex(o => o.id == tag.id)
            item.goodsSkusCardValue.splice(i, 1)
            getTableData()
        }).finally(() => loading.value = false)
    }

    // 显示input框
    const showInput = () => {
        inputVisible.value = true
        nextTick((_) => {
            saveTagInput.value.$refs.input.focus()
        })
    }

    // 创建
    const handleInputConfirm = () => {
        if (!inputValue.value) {
            inputVisible.value = false
            inputValue.value = ''
            return
        }

        loading.value = true
        createGoodsSkusCardValue({
            goods_skus_card_id: id,
            name: item.name,
            order: 50,
            value: inputValue.value
        }).then(res => {
            item.goodsSkusCardValue.push({
                ...res,
                text: inputValue.value
            })
            getTableData()
        }).finally(() => {
            inputVisible.value = false
            inputValue.value = ''
            loading.value = false
        })
    }

    // 修改
    const handleChange = (value, tag) => {
        loading.value = true
        updateGoodsSkusCardValue(tag.id, {
                goods_skus_card_id: id,
                name: item.name,
                order: 50,
                value
            }).then(res => {
                tag.value = value
                getTableData()
            })
            .catch(err => tag.text = tag.value)
            .finally(() => loading.value = false)
    }

    return {
        item,
        loading,
        handleChange,
        handleInputConfirm,
        showInput,
        handleClose,
        inputVisible,
        inputValue,
        saveTagInput
    }
}

// 获取规格表格数据
function getTableData() {
    setTimeout(() => {
        if (sku_card_list.value.length === 0) return []

        let list = []
        sku_card_list.value.forEach(o => {
            if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) list.push(o.goodsSkusCardValue)
        })
        if (list.length == 0) return []

        let arr = cartesianProductOf(...list)

        // 获取之前的规格列表，并且将规格ID排序之后转化为字符串
        let beforeSkuList = JSON.parse(JSON.stringify(sku_list.value)).map(o => {
            if (!Array.isArray(o.skus)) o.skus = Object.keys(o.skus).map(k => o.skus[k])
            o.skusId = o.skus.sort((a, b) => a.id - b.id).map(s => s.id).join(',')
            return o
        })
        sku_list.value = []
        sku_list.value = arr.map(skus => {
            let o = getBeforeSkuItem(JSON.parse(JSON.stringify(skus)), beforeSkuList)
            return {
                skus,
                image: o ? o.image : "",
                pprice: o ? o.pprice : 0,
                oprice: o ? o.oprice : 0,
                cprice: o ? o.cprice : 0,
                stock: o ? o.stock : 0,
                volume: o ? o.volume : 0,
                weight: o ? o.weight : 0,
                code: o ? o.code : '',
                goods_id: goodsId.value
            }
        })
    }, 300)
}

function getBeforeSkuItem(skus, beforeSkuList) {
    let skusId = skus.sort((a, b) => a.id - b.id).map(s => s.id).join(',')
    return beforeSkuList.find(o => skus.length > o.skus.length ? (skusId.indexOf(o.skusId) != -1) : (o.skusId.indexOf(skusId)) != -1)
}

// 初始化表格数据
export function initSkuTable() {
    const tableLoading = ref(false)

    const skuLabels = computed(() => sku_card_list.value.filter(v => v.goodsSkusCardValue.length > 0))

    // 获取表头
    const tableThs = computed(() => {
        let length = skuLabels.value.length
        return [
            { name: "商品规格", rowspan: length > 0 ? 1 : 2, colspan: length, width: "" },
            { name: "销售价", rowspan: 2, width: "100" },
            { name: "市场价", rowspan: 2, width: "100" },
            { name: "成本价", rowspan: 2, width: "100" },
            { name: "库存", rowspan: 2, width: "100" },
            { name: "体积", rowspan: 2, width: "100" },
            { name: "重量", rowspan: 2, width: "100" },
            { name: "编码", rowspan: 2, width: "100" }
        ]
    })

    // getTableData()

    return {
        skuLabels,
        sku_list,
        tableThs,
        tableLoading
    }
}