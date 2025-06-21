const STORAGE_KEY = 'global-store'

interface GlobalState {
  namespaceCode: string
  appCode: string
}

const defaultState: GlobalState = {
  namespaceCode: '',
  appCode: ''
}

class GlobalStore {
  private state: GlobalState

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY)
    this.state = saved ? JSON.parse(saved) : { ...defaultState }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state))
  }

  getNamespaceCode() {
    return this.state.namespaceCode
  }

  setNamespaceCode(namespaceCode: string) {
    this.state.namespaceCode = namespaceCode
    this.save()
  }

  getAppCode() {
    return this.state.appCode || ''
  }

  setAppCode(appCode: string) {
    this.state.appCode = appCode
    this.save()
  }

  clear() {
    this.state = { ...defaultState }
    localStorage.removeItem(STORAGE_KEY)
  }
}

// 导出为单例
export const globalStore = new GlobalStore()
