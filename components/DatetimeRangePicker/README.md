<!--
 * @Author: CasualMing
 * @Date: 2021-03-01 09:05:49
 * @LastEditTime: 2021-10-20 10:06:26
 * @Description: DatetimeRangePicker组件说明文档
-->
## 功能
  + 选择一定范围的日期时间

## 属性

| 属性            | 描述  | 类型             | 可选值| 默认值 |
|-----------------|-------|------------------|------|----------|
| value / v-model | 传入的初始值，格式必须为数组，默认为[] ，如果开始时间或者结束时间为空， 就令其为空的字符串，例如 ['',value]、 [value,''] | Array<Date,Date> | ——| ——     |
| disabledDate    | 设置禁用状态，参数为当前日期，要求返回 Boolean   | Function         | —— | ——     |
| shortcuts       | 基于内置的快捷方式，进行配置                    | Array< String >  | today /  yesterday /  week /  lastWeek /  month /  lastMonth /  year /  lastyear /  past_7_days /  past_30_days | [ today ,  yesterday ,  week ,  lastWeek ,  month ,  lastMonth ,  year ,  lastyear ,  past_7_days ,  past_30_days ] |
| shortcutsTexts  | 快捷方式的文字描述,必须得跟shortcuts顺序一致   | Array< String >  | 今日 /  昨日 /  本周 /  上周 /  本月 /  上月 /  本年 /  去年 /  过去7天 /  过去30天| [ 今日 ,  昨日 ,  本周 ,  上周 ,  本月 ,  上月 ,  本年 ,  去年 ,  过去7天 ,  过去30天 ]|
| selfShortcuts   | 外部传入的自定义快捷方式，如果内置快捷方式的不满足，则可以采用自定义，由外部传入进去 | Array| —— | ——     |
| type| 时间控件的类型 | String           | datetimerange / daterange         | datetimerange    |
| defaultTime     | 时间范围的默认具体时刻     | Array< String >  | 第一项指定开始日期的时刻，第二项指定结束日期的时刻。不指定会使用时刻 00:00:00    | [ "00:00:00" , "23:59:59" ] |
| valueFormat     | 以什么格式返回，如果不传，则是默认的时间格式   | String           | 见 element的日期格式，暂不支持 ' [MM] ' 类型， 例如：YYYY-MM-DD -> 2021-10-19 | —— |
| unlinkPanels     | 在范围选择器里取消两个日期面板之间的联动      | Boolean           | true / false | false |


## 事件
  + change：监听选择器的值的改变，参数是新的value

## 方法
  + focus：使 input 获取焦点

## 例子
    ```
    <template>
        <DatetimeRangePicker v-model="value" />
    </template>

    <script>
    import { DatetimeRangePicker } from "sinosun-operation-ui";
    export default {
        components: {
            DatetimeRangePicker
        },
        data(){
            return {
                value: []
            }
        }
    };
    </script>
    ```
    