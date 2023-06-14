import * as components from './components.js'
export const install = (app) => {
  Object.keys(components).forEach(compName => {
    const registered = app.component(compName)
    if (!registered) {
      app.component(String(compName), components[compName])
    }
  })
}

export default {
  install
}
