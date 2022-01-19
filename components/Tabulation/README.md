<!--
 * @Author: CasualMing
 * @Date: 2021-11-24 09:33:16
 * @LastEditTime: 2021-12-01 17:12:54
 * @Description: 表格组件的说明文档
 * @FilePath: \sinosun-operation-ui\components\Tabulation\README.md
-->
## 功能
  + 列表表格及分页 基于element-ui 组件进行二次封装

## 说明
> 由于表格配置项比较多，所以具体的每一项配置，可以查看 doc 目录具体的 md 文档

## 功能
 1. 表格支持 json 配置
 2. 支持加载 loading
 3. 支持表格分页
 4. 支持表格自定义组件渲染
 5. 表格支持单选、多选处理，内置单选、多选回显逻辑处理
 6. 表格支持滚动加载分页
 7. 组件字段无缝衔接 `element-ui` 的 `table` 组件字段配置
 8. 高度支持自定义，定制化


## 配置

| 属性            | 描述  | 类型             | 详情 |
|-----------------|-------|------------------|------|
| data | 表格所需要渲染的数据源 |  JSONArray  | --  |
| columns | 表头数据及配置 |  JSONArray  | [columns 配置](doc/columns.md)   |
| pagination | 表格分页数据配置 |  Object  | [pagination 配置](doc/pagination.md)   |
| options | 表格配置 |  JSONArray  | [options 配置](doc/options.md)   |
| row-handle | 表格操作列配置 |  JSONArray  | [row-handle 配置](doc/row-handle.md)   |
| loading-options | 表格 loading 配置 |  Object  | [loading-options 配置](doc/loading-options.md)   |
| index-row | 表格单选配置 |  Object  | [index-row 配置](doc/index-row.md)   |
| selection-row | 表格多选配置 |  Object  | [selection-row 配置](doc/selection-row.md)   |
| load-more-options | 表格滚动加载更多配置 |  Object  | [load-more-options 配置](doc/load-more-options.md)   |


## 事件

| 属性            | 描述  | 类型             | 详情 |
|-----------------|-------|------------------|------|
| events | 表格可监听的事件 |  Function  | [events 配置](doc/events.md)   |


## 事件 methods

| 属性            | 描述  | 类型             | 详情 |
|-----------------|-------|------------------|------|
| methods | 表格调用的方法 |  Function  | [methods 配置](doc/methods.md)   |

## 插槽 Slot

| 属性            | 描述  | 类型             | 详情 |
|-----------------|-------|------------------|------|
| slots | 表格可使用的插槽 |  String  | [slots 配置](doc/slots.md)   |