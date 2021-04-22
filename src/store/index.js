import { createStore, createLogger } from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import state from './state'

// 在开发环境使用createLogger插件
const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  mutations,
  actions,
  getters,
  strict: debug, // 严格模式
  plugins: debug ? [createLogger()] : []
})
