export default function ({ $axios, store }) {
  $axios.onRequest((config) => {
    if (store.state.token !== '') {
      config.headers.Authorization = 'Bearer ' + store.state.token
    }
  })

  $axios.onResponseError((error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      store.commit('changeToken', { token: '' })
    }
    return Promise.reject(error)
  })
}
