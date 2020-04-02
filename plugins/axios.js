export default function ({ $axios, redirect }) {
  $axios.onRequest((config) => {
    config.headers.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTg1NzkxMDg0LCJleHAiOjE1ODgzODMwODR9.n431aT9uy2j_ekSYpoXHU8SfNo560DkoBieNA8uVW9I'
  })
}
