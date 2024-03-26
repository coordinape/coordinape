/*
{
  fid: 1,
  url: 'http://localhost:3000/api/frames/example',
  messageHash: '0x00eef185fb1fb8f19d54cc1af27b61aa758d4ed0',
  timestamp: 101083532,
  network: 1,
  buttonIndex: 1,
  castId: { fid: 1, hash: '0x0000000000000000000000000000000000000000' }
}
 */
export type FrameMessage = {
  fid: number;
  url: string;
  messageHash: string;
  timestamp: number;
  network: number;
  buttonIndex: number;
  castId: { fid: number; hash: string };
};
