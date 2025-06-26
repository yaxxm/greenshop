import axios from '~/axios'
import { queryParams } from '~/composables/util'

export function getGoodsList(page, query = {}) {
    let q = queryParams(query, true)
    return axios.get(`/admin/goods/${page}${q}`)
}

export function deleteGoods(ids) {
    return axios.post(`/admin/goods/delete_all`, { ids })
}

// 批量上架/下架商品
export function updateGoodsStatus(ids, status) {
    return axios.post(`/admin/goods/changestatus`, { ids, status })
}

// 批量恢复商品
export function restoreGoods(ids) {
    return axios.post(`/admin/goods/restore`, { ids })
}

// 彻底删除商品
export function destroyGoods(ids) {
    return axios.post(`/admin/goods/destroy`, { ids })
}

// 审核商品
export function checkGoods(id, ischeck) {
    return axios.post(`/admin/goods/${id}/check`, { ischeck })
}

// 发布商品
export function createGoods(data) {
    return axios.post(`/admin/goods`, data)
}

// 修改商品
export function updateGoods(id, data) {
    return axios.post(`/admin/goods/${id}`, data)
}


// 设置商品轮播图
export function setGoodsBanner(id, data) {
    return axios.post(`/admin/goods/banners/${id}`, data)
}

// 查看商品详情
export function readGoods(id) {
    return axios.get(`/admin/goods/read/${id}`)
}

// 设置商品规格
export function updateGoodsSkus(id, data) {
    return axios.post(`/admin/goods/updateskus/${id}`, data)
}

// 添加商品规格选项
export function createGoodsSkusCard(data) {
    return axios.post(`/admin/goods_skus_card`, data)
}

// 修改商品规格选项
export function updateGoodsSkusCard(id, data) {
    return axios.post(`/admin/goods_skus_card/${id}`, data)
}

// 选择设置商品规格选项
export function chooseAndSetGoodsSkusCard(id, data) {
    return axios.post(`/admin/goods_skus_card/${id}/set`, data)
}

// 删除商品规格选项
export function deleteGoodsSkusCard(ids) {
    return axios.post(`/admin/goods_skus_card/${ids[0]}/delete`)
}

// 排序商品规格选项
export function sortGoodsSkusCard(data) {
    return axios.post(`/admin/goods_skus_card/sort`, data)
}

// 添加商品规格选项属性
export function createGoodsSkusCardValue(data) {
    return axios.post(`/admin/goods_skus_card_value`, data)
}

// 修改商品规格选项
export function updateGoodsSkusCardValue(id, data) {
    return axios.post(`/admin/goods_skus_card_value/${id}`, data)
}

// 删除商品规格选项
export function deleteGoodsSkusCardValue(ids) {
    return axios.post(`/admin/goods_skus_card_value/${ids[0]}/delete`)
}