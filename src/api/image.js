import axios from '~/axios'

export function uploadImage(data) {
    return axios.post("/admin/image/upload", data)
}

export function updateImage(id, data) {
    return axios.post("/admin/image/" + id, data)
}

export function getImageList(page, query = {}) {
    return axios.get(`/admin/image_class/${query.image_class_id}/image/${page}`)
}

export function deleteImage(ids) {
    return axios.post(`/admin/image/delete_all`, { ids })
}