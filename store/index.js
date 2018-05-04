import Vuex from 'vuex'
import lifescopeObjects from 'lifescope-objects';

const createStore = () => {
  return new Vuex.Store({
    state: {
      LSObjs: lifescopeObjects
    }
  })
}

export default createStore