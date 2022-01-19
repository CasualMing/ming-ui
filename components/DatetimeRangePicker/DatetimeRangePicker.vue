<!--
 * @Author: CasualMing
 * @Date: 2021-02-23 09:37:58
 * @LastEditTime: 2021-11-24 09:48:47
 * @Description: 带范围区间的日期时间选择器
-->
<template>
    <div class="datetimeRangePicker">
        <el-date-picker ref="ElDatePicker" :value="value" :default-time="defaultTime" valueFormat :unlinkPanels="unlinkPanels" :type="type" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" disabledDate :picker-options="pickerOptions" @input="onChange" popperClass="datePicker_panel">
        </el-date-picker>
    </div>

</template>

<script>
const ElDatePicker = ()=>import("element-ui/lib/date-picker");
import {
    getToday,
    getYesterday,
    getWeek,
    getLastweek,
    getMonth,
    getLastmonth,
    getYear,
    getLastyear,
    getPastTimeByNum,
    getPastTimeBy7,
    getPastTimeBy30,
    getPastTimeBy90,
    getPastTimeBy180,
} from "./time";

import { dateFormat, deepCopy } from "../../lib/utils/commonUtil";
export default {
    name: "DatetimeRangePicker",
    components: {
        "el-date-picker": ElDatePicker,
    },
    model: {
        prop: "value",
        event: "change",
    },
    props: {
        /**
         *  传入的初始值，外部可以使用 v-model 绑定
         */
        value: [Array, String, Date],
        /**
         * 设置禁用状态，参数为当前日期，要求返回 Boolean
         */
        disabledDate: {
            type: Function,
        },
        /**
         *  基于内置的快捷方式，进行配置
         */
        shortcuts: {
            type: Array,
            default: () => {
                return [
                    "today",
                    "yesterday",
                    "week",
                    "lastWeek",
                    "month",
                    "lastMonth",
                    "year",
                    "lastyear",
                    "past_7_days",
                    "past_30_days",
                ];
            },
        },
        /**
         * 快捷方式的文字描述
         */
        shortcutsTexts: {
            type: Array,
            default: () => {
                return [
                    "今日",
                    "昨日",
                    "本周",
                    "上周",
                    "本月",
                    "上月",
                    "本年",
                    "去年",
                    "过去7天",
                    "过去30天",
                ];
            },
        },
        /**
         * 外部传入的自定义快捷方式
         */
        selfShortcuts: Array,
        /**
         * 是否需要快捷方式
         */
        needQuick: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            default: "datetimerange",
        },
        /**
         * 时间范围的默认具体时刻
         * 只针对于 datetimerange 类型。并且 valueFormat 是具体的时刻的
         */
        defaultTime: {
            type: Array,
            default: () => {
                return ["00:00:00", "23:59:59"];
            },
        },
        /**
         * 以什么格式返回，如果不传，则是默认的时间格式
         */
        valueFormat: String,

        /**
         * valueFormat 的js时间戳 类型的补充，是否需要十位时间戳
         */
        isDecimal: {
            type: Boolean,
            default: false,
        },
        /**
         * 在范围选择器里取消两个日期面板之间的联动
         */
        unlinkPanels: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            // 快捷选项
            pickerOptions: {
                disabledDate: this.disabledDate,
            },
        };
    },
    methods: {
        // 监听输入框的改变
        onChange(value) {
            let timeDate = value;
            const { ElDatePicker } = this.$refs;
            let shortcuts = [];
            if (ElDatePicker) {
                shortcuts = ElDatePicker.picker.shortcuts;
            }
            if (this.type.includes("range")) {
                timeDate = value || [];
                if (!!timeDate) {
                    const { isInternalTime, i } = this.internalTime(timeDate);
                    if (isInternalTime) {
                        this.$emit("update:selectText", shortcuts[i].text);
                    } else {
                        this.$emit("update:selectText", "");
                    }
                }
            } else {
                timeDate = value || "";
            }
            if (this.valueFormat && !!timeDate) {
                if (this.valueFormat === "timestamp") {
                    // 时间戳
                    const start = this.isDecimal
                        ? new Date(timeDate[0]).getTime() / 1000
                        : new Date(timeDate[0]).getTime();
                    const end = this.isDecimal
                        ? new Date(timeDate[1]).getTime() / 1000
                        : new Date(timeDate[1]).getTime();
                    this.$emit("change", [start, end]);
                } else {
                    const time = [
                        dateFormat(timeDate[0], this.valueFormat),
                        dateFormat(timeDate[1], this.valueFormat),
                    ];
                    this.$emit("change", time);
                }
            } else {
                this.$emit("change", timeDate);
            }
        },
        /**
         * 用于判断是不是内置时间，用于判断这个时间，是点击快捷方式，还是用户点击时间改变的
         * @date 2021-10-18
         * @param {Array<Date,Date>} time
         * @returns {Boolean}
         */
        internalTime(time) {
            const list = [
                getToday(),
                getYesterday(),
                getWeek(),
                getLastweek(),
                getMonth(),
                getLastmonth(),
                getYear(),
                getLastyear(),
                getPastTimeBy7(),
                getPastTimeBy30(),
                getPastTimeBy90(),
                getPastTimeBy180(),
            ];
            const format = "YYYY-MM-DD HH:mm:ss";
            const timeEr =
                dateFormat(time[0], format) + "&" + dateFormat(time[1], format);
            const item = list
                .map((t, idx) => {
                    const i =
                        dateFormat(t[0], format) +
                        "&" +
                        dateFormat(t[1], format);
                    if (i === timeEr) {
                        return {
                            isInternalTime: true,
                            i: idx,
                        };
                    } else {
                        return {
                            isInternalTime: false,
                            i: idx,
                        };
                    }
                })
                .filter((t) => t.isInternalTime);
            return item.length ? item[0] : { isInternalTime: false };
        },
        setToday(picker) {
            let time = getToday();
            picker.$emit("pick", time);
            this.setTextByType("today");
        },
        setYesterday(picker) {
            let time = getYesterday();
            picker.$emit("pick", time);
            this.setTextByType("yesterday");
        },
        setWeek(picker) {
            let time = getWeek();
            picker.$emit("pick", time);
            this.setTextByType("week");
        },
        setLastweek(picker) {
            let time = getLastweek();
            picker.$emit("pick", time);
            this.setTextByType("lastWeek");
        },
        setMonth(picker) {
            let time = getMonth();
            picker.$emit("pick", time);
            this.setTextByType("month");
        },
        setLastmonth(picker) {
            let time = getLastmonth();
            picker.$emit("pick", time);
            this.setTextByType("lastMonth");
        },
        setYear(picker) {
            let time = getYear();
            picker.$emit("pick", time);
            this.setTextByType("year");
        },
        setLastyear(picker) {
            let time = getLastyear();
            picker.$emit("pick", time);
            this.setTextByType("lastyear");
        },
        setPastTimeByNum(picker, day) {
            let time = getPastTimeByNum(day);
            picker.$emit("pick", time);
        },
        setPastTimeBy7(picker) {
            this.setPastTimeByNum(picker, 7);
            this.setTextByType("past_7_days");
        },
        setPastTimeBy30(picker) {
            this.setPastTimeByNum(picker, 30);
            this.setTextByType("past_30_days");
        },
        setPastTimeBy90(picker) {
            this.setPastTimeByNum(picker, 90);
            this.setTextByType("past_90_days");
        },
        setPastTimeBy180(picker) {
            this.setPastTimeByNum(picker, 180);
            this.setTextByType("past_180_days");
        },
        initOptions() {
            const { shortcuts, shortcutsTexts, needQuick, selfShortcuts } =
                this;
            if (selfShortcuts) {
                this.pickerOptions = deepCopy(selfShortcuts);
                return false;
            }
            const map = {
                today: this.setToday,
                yesterday: this.setYesterday,
                week: this.setWeek,
                lastWeek: this.setLastweek,
                month: this.setMonth,
                lastMonth: this.setLastmonth,
                year: this.setYear,
                lastyear: this.setLastyear,
                past_7_days: this.setPastTimeBy7,
                past_30_days: this.setPastTimeBy30,
                past_90_days: this.setPastTimeBy90,
                past_180_days: this.setPastTimeBy180,
            };
            if (!needQuick) return false;
            const arr = [];
            shortcuts.forEach((ele, i) => {
                const obj = {
                    text: shortcutsTexts[i],
                    index: `${ele}--${i}`,
                    onClick: map[ele],
                };
                arr.push(obj);
            });
            this.$set(this.pickerOptions, "shortcuts", arr);
        },
        setTextByType(type) {
            const {
                picker: { shortcuts },
            } = this.$refs.ElDatePicker;
            if (!shortcuts) {
                this.$emit("update:selectText", "");
                return false;
            }
            const item = shortcuts.filter((t) => {
                return t.index.split("--")[0] === type;
            });
            this.$emit("update:selectText", item[0].text);
        },

        focus() {
            this.$refs.ElDatePicker.focus();
        },
    },
    watch: {
        shortcuts: {
            handler: function (t) {
                this.initOptions();
                return t;
            },
            immediate: true,
            deep: true,
        },
        disabledDate: {
            handler: function (t) {
                this.$set(this.pickerOptions, "disabledDate", t);
            },
            immediate: true,
            deep: true,
        },
    },
};
</script>

<style src="./DatetimeRangePicker.less" lang="less"></style>