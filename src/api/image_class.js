import axios from '~/axios'

export function createImageClass(data) {
    return axios.post("/admin/image_class", data)
}

export function updateImageClass(id, data) {
    return axios.post("/admin/image_class/" + id, data)
}

export function getImageClassList(page) {
    return axios.get("/admin/image_class/" + page)
}

export function deleteImageClass(ids) {
    return axios.post(`/admin/image_class/${ids[0]}/delete`)
}