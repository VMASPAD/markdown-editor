import { ElectronAPI } from '@electron-toolkit/preload'


interface api{
  getArchivesMd: () => Promise<string[]>
}
declare global {
  interface Window {
    electron: ElectronAPI
    api: api
  }
}
