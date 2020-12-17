import {get, put, post, deleteid } from "./request";

//add.vue

export function categoriesget() {
    return get("categories")
}

export function categoriesgetid(id, params) {
    return get("categories/" + id + "/attributes", params)
}

export function goodspost(params) {
    return post("goods", params)
}

//categories
export function categoriesgetparams(params) {
    return get("categories", params)
}

export function categoriespost(params) {
    return post("categories", params)
}

export function categoriesget_id(id) {
    return get("categories/" + id)
}

export function categoriesputid(id, params) {
    return put("categories/" + id, params)
}

export function categoriesdelete(id) {
    return deleteid("categories/" + id)
}

//goods
export function goodget(params) {
    return get("goods", params)
}

export function goodssdelete(id) {
    return deleteid("goods/" + id)
}

export function goodgetid(id) {
    return get("goods/" + id)
}

export function goodsputid(id, params) {
    return put("goods/" + id, params)
}
//params
export function categoriespostid(id, params) {
    return post("categories/" + id + "/attributes", params)
}

export function categoriesputiid(id1, id2, params) {
    return put("categories/" + id1 + "/attributes/" + id2, params)
}

export function categoriesgetiid(id1, id2, params) {
    return get("categories/" + id1 + "/attributes/" + id2, params)
}

export function categoriesdeleteiid(id1, id2) {
    return deleteid("categories/" + id1 + "/attributes/" + id2)
}


/*this.$http.get('categories')

this.$http.get(`categories/${this.cateid}/attributes`, {
    params: { sel: 'many' }
  })

  await this.$http.get(`categories/${this.cateid}/attributes`, {
    params: { sel: 'only' }
  })

  await this.$http.post(`goods`, form)*/
/*this.$http.get('categories', { params: this.queryinfo })
this.$http.post('categories', this.addcartform)
this.$http.get('categories', { params: { type: 2 } })
this.$http.get(`categories/` + item.cat_id)
this.$http.put(`categories/` + this.editcartform.cat_id, this.editcartform)
this.$http.delete('categories/' + item.cat_id)

//this.$http.get('categories')   this.$http.get('categories')
this.$http.get(`goods`, { params: this.goodslist })
await this.$http.delete(`goods/${id}`)
await this.$http.get(`goods/` + id)
this.$http.put(`goods/` + form.goods_id, form)*/



//await this.$http.get(`categories/${this.cateid}/attributes`, { params: { sel: this.activeName } })
/*this.$http.post(`categories/${this.cateid}/attributes`, {
  attr_name: this.addform.attr_name,
  attr_sel: this.activeName
})
await this.$http.put(`categories/${this.cateid}/attributes/${this.editform.attr_id}`, {
  attr_name: this.editform.attr_name,
  attr_sel: this.activeName
})
await this.$http.get(`categories/${this.cateid}/attributes/${id}`, { params: { id: this.activeName } })
await this.$http.delete(`categories/${this.cateid}/attributes/${id}`)
await this.$http.put(`categories/${this.cateid}/attributes/${item.attr_id}`, {
  attr_name: item.attr_name,
  attr_sel: item.attr_sel,
  attr_vals: item.attr_vals.join(' ')
})*/