import {create} from 'zustand';
import {devtools, persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IState {
  ssi: string;
  onlineDenomination: [];
  selectedReload: any;
  frameHeight: number;
  updateSSI: (ssi: string) => void;
  updateOnlineDenomination: (data) => void;
  updateSelectedReload: (reload) => void;
  updateFrameHeight: (height) => void;
}

const useZustandStoreRemote = create<IState>()(
  devtools(set => ({
    ssi: '',
    onlineDenomination: [],
    selectedReload: {},
    frameHeight: 0,
    updateSSI: ssi => set(() => ({ssi: ssi})),
    updateOnlineDenomination: data => set(() => ({onlineDenomination: data})),
    updateSelectedReload: reload => set(() => ({selectedReload: reload})),
    updateFrameHeight: height => set(() => ({frameHeight: height})),
  })),
);

export type TUseZustandStore = typeof useZustandStoreRemote;

export default useZustandStoreRemote;
