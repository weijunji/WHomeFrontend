export const state = () => ({
  token: '',
  username: '',
  email: '',
  assets_host: ''
})

export const mutations = {
  changeToken (state, user) {
    if (user.token === '') {
      state.token = ''
      window.localStorage.token = ''
      state.username = ''
      window.localStorage.username = ''
      state.email = ''
      window.localStorage.email = ''
    } else {
      state.token = user.token
      window.localStorage.token = state.token
      state.username = user.username
      window.localStorage.username = state.username
      state.email = user.email
      window.localStorage.email = state.email
    }
  },
  init (state) {
    if (window.localStorage.token) {
      state.token = window.localStorage.token
      state.username = window.localStorage.username
      state.email = window.localStorage.email
    }
    state.assets_host = process.env.ASSETS_URL
  }
}
