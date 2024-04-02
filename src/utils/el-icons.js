import {
  Edit, Minus, Plus, InfoFilled, Search, CirclePlus, Delete,
  ArrowDown, ArrowUp, Bottom, Top, Back, Right, BottomLeft, TopRight
} from '@element-plus/icons-vue'

export function registerIcon(e) {
  // app.component('el-icon-edit', Edit)
  // app.component('el-icon-minus', Minus)
  // app.component('el-icon-plus', Plus)
  // app.component('el-icon-info', InfoFilled)
  // app.component('el-icon-search', Search)
  // app.component('el-icon-circle-plus-outline', CirclePlus)
  // app.component('el-icon-delete', Delete)
  // app.component('el-icon-arrow-down', ArrowDown)
  // app.component('el-icon-arrow-up', ArrowUp)
  e.component("el-icon-edit", Edit),
    e.component("el-icon-minus", Minus),
    e.component("el-icon-plus", Plus),
    e.component("el-icon-info", InfoFilled),
    e.component("el-icon-search", Search),
    e.component("el-icon-circle-plus-outline", CirclePlus),
    e.component("el-icon-delete", Delete),
    e.component("el-icon-arrow-down", ArrowDown),
    e.component("el-icon-arrow-up", ArrowUp),
    e.component("el-icon-bottom", Bottom),
    e.component("el-icon-top", Top),
    e.component("el-icon-back", Back),
    e.component("el-icon-right", Right),
    e.component("el-icon-bottom-left", BottomLeft),
    e.component("el-icon-top-right", TopRight);
    // for (const [o,t] of Object.entries(ElementPlusIconsVue))
    //     eleIcons.push(o),
    //     e.component(o) || e.component(o, t)
}
