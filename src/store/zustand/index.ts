import {create} from 'zustand';
import {devtools, persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IState {
  bear: number;
  increaseBear: (by: number) => void;
}

const useZustandStoreRemote = create<IState>()(
  devtools(
    persist(
      set => ({
        bear: 0,
        increaseBear: (by: number) => set(state => ({bear: state.bear + by})),
      }),
      {
        name: 'zustand-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
);

export type TUseZustandStore = typeof useZustandStoreRemote;

export default useZustandStoreRemote;
