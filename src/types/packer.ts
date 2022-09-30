export interface Pointer {
  position: number;
  pointer: number;
}

export interface PackState {
  staticBuffer: Uint8Array;
  dynamicBuffer: Uint8Array;
  pointers: Pointer[];
}
