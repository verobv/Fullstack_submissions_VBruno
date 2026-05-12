import { create } from 'zustand'

const useStore = create(set => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    incrementGood: () => set(state => ({ good: state.good + 1 })),
    incrementNeutral: () => set(state => ({ neutral: state.neutral + 1 })),
    incrementBad: () => set(state => ({ bad: state.bad + 1 })),
  }  
}))

// the hook functions that are used elsewhere in app
export const useGood = () => useStore(state => state.good)
export const useNeutral = () => useStore(state => state.neutral)
export const useBad = () => useStore(state => state.bad)
export const useControls = () => useStore(state => state.actions)