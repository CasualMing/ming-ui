# 运营组件库更改记录

##   v1.0.0 (2021-12-1)
### Added

1. 基于 `Element-UI@2+` 的 `Table、Button、Switch、Pagination ……` 等组件，二次封装成 `Tabulation` 组件。支持分页、loading、滚动加载等功能

2. 基于 `Element-UI@2+` 的 `Dialog、Button` 等组件，二次封装成 `Dialog` 组件。进行项目中样式的统一管理
2. 基于 `Element-UI@2+` 的 `Message` 组件，二次封装成 `MessageTip` 组件。进行项目中样式的统一管理

### Changed

1. 修改 `Layout` 组件内的获取总路由的逻辑，去掉之前需要依赖项目里定义 `MenuState` 类的问题
2. 修改 `SelectListPopup` 组件内的表格组件，修改为统一使用 `Tabulation` 组件，使其更方便统一管理
3. 修改  `ChooseFile` 组件内的布局，适应最新变化，以及增加组件内扩展灵活性

### Fixed

1. 修复 `DatetimeRangePicker` 组件内禁止时间方法监听动态响应不及时的问题

### Removed


##   v0.0.2 (2021-11-26)

### Added

### Changed

1. 调整 `DatetimeRangePicker` 日期范围选择组件，支持外部定制快捷选项
### Fixed

### Removed


##   v0.0.1 (2021-10-19)

### Added

1. 组件库初次提交
2. 增加 `ChooseFile` 文件选择组件
3. 增加 `Layout` 布局组件
4. 增加 `DatetimeRangePicker` 时间范围选择组件
5. 增加 `LoadingTips` 加载提示组件
5. 增加 `SelectListPopup` 弹框选择组件

### Changed

### Fixed

### Removed