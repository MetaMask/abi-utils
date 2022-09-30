export type Pointer = {
  position: number;
  pointer: number;
};

export type PackState = {
  staticBuffer: Uint8Array;
  dynamicBuffer: Uint8Array;
  pointers: Pointer[];
};
