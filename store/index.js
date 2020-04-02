export const state = () => ({
  token: '',
  assets_host: ''
})

export const mutations = {
  changePWD (state, token) {
    state.token = token
    window.localStorage.token = state.token
  },
  init (state) {
    if (window.localStorage.token) {
      state.token = window.localStorage.token
    }
    state.assets_host = process.env.ASSETS_URL
  }
}
