import {get, put, post, deleteid } from "./request";
//power.vue
export function listgget() {
    return get("rights/list")
}

//roles.vue

export function rolesget() {
    return get("roles")
}

export function rolesdelete(id1, id2) {
    return deleteid("roles/" + id1 + "/rights/" + id2)
}

export function treeget() {
    return get("rights/tree")
}

export function rolespostid(id, params) {
    return post("roles/" + id + "/rights", params)
}

export function rolespost(params) {
    return post("roles", params)
}

export function rolesgetid(id) {
    return get("roles/" + id)
}

export function rolesputid(id, params) {
    return put("roles/" + id, params)
}

export function rolesdeleteid(id) {
    return deleteid("roles/" + id)
}
//this.$http.get('rights/list')

/*this.$http.get('roles')

this.$http.delete(`roles/${role.id}/rights/${id}`)

this.$http.get('rights/tree')

this.$http.post(`roles/${this.roleid}/rights`, { rids: idstr })

this.$http.post(`roles`, this.rolesform)

this.$http.get('roles/' + this.roleid)

this.$http.put('roles/' + this.rolesdata.roleId, {
    roleName: this.rolesdata.roleName,
    roleDesc: this.rolesdata.roleDesc
  })

  await this.$http.delete('roles/' + item.id)*/