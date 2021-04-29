import { createRouter, createWebHashHistory } from 'vue-router'
const Recommend = () => import('@/views/recommend'/* webpackChunkName: "recommend" */)
const Singer = () => import('@/views/singer'/* webpackChunkName: "singer" */)
const TopList = () => import('@/views/top-list'/* webpackChunkName: "top-list" */)
const Search = () => import('@/views/search'/* webpackChunkName: "search" */)
const SingerDetail = () => import('@/views/singer-detail'/* webpackChunkName: "singer-detail" */)
const Album = () => import('@/views/album'/* webpackChunkName: "album" */)
const TopDetail = () => import('@/views/top-detail'/* webpackChunkName: "top-detail" */)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        name: 'Album',
        component: Album
      }
    ]
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
    component: TopList,
    children: [
      {
        path: ':id',
        name: 'TopDetail',
        component: TopDetail
      }
    ]
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    children: [
      {
        path: ':id',
        name: 'SingerDetail',
        component: SingerDetail
      }
    ]
  }
]

const router = createRouter({
  // hash模式
  history: createWebHashHistory(),
  routes
})

export default router
