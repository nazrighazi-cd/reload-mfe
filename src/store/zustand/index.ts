import {create} from 'zustand';
import {devtools, persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IState {
  ssi: string;
  updateSSI: (ssi: string) => void;
}

const useZustandStoreRemote = create<IState>()(
  devtools(
    persist(
      set => ({
        ssi: '',
        updateSSI: ssi => set(() => ({ssi: ssi})),
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
