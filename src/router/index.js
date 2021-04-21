import { createRouter, createWebHashHistory } from 'vue-router'
const Recommend = () => import('@/views/recommend'/* webpackChunkName: "recommend" */)
const Singer = () => import('@/views/singer'/* webpackChunkName: "singer" */)
const TopList = () => import('@/views/top-list'/* webpackChunkName: "top-list" */)
const Search = () => import('@/views/search'/* webpackChunkName: "search" */)
const SingerDetail = () => import('@/views/singer-detail'/* webpackChunkName: "singer-detail" */)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend
  },
  {
    path: '/singer',
    name: 'Singer',
    component: Singer,
    children: [
      {
        path: ':id',
        name: 'SingerDetail',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/top-list',
    name: 'TopList',
    component: TopList
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  }
]

const router = createRouter({
  // hash模式
  history: createWebHashHistory(),
  routes
})

export default router
