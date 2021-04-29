// import { ref } from 'vue'
import { save, remove } from '@/assets/js/array-store'
import { SEARCH_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'

export default function useSearchHistory() {
  const maxlen = 200

  const store = useStore()

  function saveSearch(query) {
    const searches = save(query, SEARCH_KEY, (item) => {
      return item === query
    }, maxlen)

    store.commit('setSearchHistory', searches)
  }

  function deleteSearch(query) {
    const searches = remove(SEARCH_KEY, (item) => {
      return item === query
    })

    store.commit('setSearchHistory', searches)
  }

  return {
    saveSearch,
    deleteSearch
  }
}
