import {get, post, put, deleteid } from "./request";

export function usersget(params) {
    return get("users", params)
}

export function usersput(id, state) {
    return put("users/" + id + "/state/" + state)
}

/*this.$http.get('users', {
    params: this.userslist
  })

  this.$http.put(`users/${value.id}/state/${value.mg_state}`)

  this.$http.post('users', this.addform)

  this.$http.get('users/' + id)

  this.$http.put('users/' + this.editform.id, {
    email: this.editform.email,
    mobile: this.editform.mobile
  })

  await this.$http.delete('users/' + id)

  this.$http.get('roles')

  this.$http.put(`users/${this.roles.id}/role`, { rid: this.selectroles })*/