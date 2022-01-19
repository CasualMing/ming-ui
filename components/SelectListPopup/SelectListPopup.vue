<!--
 * @Author: CasualMing
 * @Date: 2021-02-26 16:44:37
 * @LastEditTime: 2022-01-19 13:38:06
 * @Description: 可选择的列表弹窗
-->
<template>
    <Dialog
        custom-class="selectListPopup"
        ref="dialog"
        width="80%"
        :value="isVisible"
        :title="title"
        showClose
        @change="(event)=>!event&&onCancel()"
    >
        <div class="dialog-content">
            <div class="content-area">
                <!-- 搜索 -->
                <slot name="header">
                    <div class="dialog-search">
                        <el-input
                            :placeholder="searchMsg"
                            :value="searchName"
                            @input="onSearchIpt"
                            @keyup.native.enter="onSearchEnter"
                        />
                        <span
                            class="icon"
                            @click="onSearchEnter"
                        ><i class="el-icon-zoom-in"></i></span>
                    </div>
                </slot>
                <!-- 列表 -->
                <Tabulation
                    class="dialog-table"
                    ref="dialogTable"
                    :data="data"
                    :options="selectListOptions"
                    :columns="columns"
                    :selectionRow="tbSelectionRow"
                    :load-more-options="loadMoreConfig"
                    :loading-options="loadingConfig"
                    :pagination="pagination"
                    @selection-change="selectChange"
                    @load-more="loadMore"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    @sort-change="handleSortChange"
                    @cell-mouse-enter="handleCellMouseEnter"
                    @cell-mouse-leave="handleCellMouseLeave"
                    @cell-click="handleCellClick"
                    @cell-dblclick="handleCellDblclick"
                    @row-click="handleRowClick"
                    @row-contextmenu="handleRowContextmenu"
                    @row-dblclick="handleRowDblclick"
                    @header-click="handleHeaderClick"
                    @header-contextmenu="handleHeaderContextmenu"
                >
                </Tabulation>
            </div>
            <!-- 选择 -->
            <div
                class="selected-area"
                v-if="isVisibleChoice"
            >
                <slot>
                    <p class="selected-title">已选择（{{selectedResult.length}}）</p>
                    <ul class="selected-list">
                        <li
                            class="selected-item"
                            v-for="(item,index) in selectedResult"
                            :key="item[idKey]"
                        >
                            <span class="name">{{item[nameKey]}}</span>
                            <img
                                class="del"
                                :src="img_del"
                                @click="onDelItem(item,index)"
                            />
                        </li>
                    </ul>
                </slot>
            </div>
        </div>
        <!-- 底部 -->
        <span
            slot="footer"
            class="dialog-footer"
        >
            <el-button @click="onCancel">取消</el-button>
            <el-button
                type="primary"
                @click="onConfirm"
            >确定</el-button>
        </span>
    </Dialog>
</template>

<script>
import { deepCopy } from "../../lib/utils/commonUtil";
const Dialog = () => import("../Dialog");
const ElButton = () => import("element-ui/lib/button");
const ElInput = () => import("element-ui/lib/input");

const Tabulation = () => import("../Tabulation");

export default {
    name: "SelectListPopup",
    components: {
        Dialog: Dialog,
        "el-button": ElButton,
        "el-input": ElInput,
        Tabulation,
    },
    props: {
        isVisible: Boolean, // 显隐
        title: String, // 标题
        data: Array, // 所有的数据
        selectedData: Array, // 外部传入的被选中数据
        columns: Array, // 列配置
        options: {
            type: Object,
            default: () => {
                return {};
            },
        }, // 表格配置
        idKey: {
            // 每条数据的唯一标识对应的字段名
            type: String,
            default: "id",
        },
        nameKey: {
            // 每条数据的名称对应的字段名
            type: String,
            default: "name",
        },
        searchMsg: {
            // 搜索输入框为空时的提示文本
            type: String,
            default: "请输入",
        },
        initMsg: {
            // 初始化时没有数据的提示信息
            type: String,
            default: "暂无数据",
        },
        initShowImg: {
            // 初始化时没有数据的时没有数据时是否展示图片
            type: Boolean,
            default: true,
        },
        error: {
            // 请求报错的时候的处理，当类型为 Function 的时候，返回值必须是 Boolean 类型
            type: [Boolean, Function],
            default: false,
        },
        errorText: {
            // 请求报错的时候展示的文字
            type: String,
            default: "服务故障，请稍后重试！",
        },
        isVisibleChoice: {
            // 是否展示表格选择之后的结果
            type: Boolean,
            default: true,
        },
        loadMoreOptions: {
            // 滚动加载配置
            type: Object,
        },
        pagination: {
            // 表格分页配置
            type: Object,
        },
        loadingOptions: Object,
    },
    data() {
        return {
            img_del: require("../../assets/img/del_sm.png"), // 删除图标
            isLoadingInit: false, // 是否正在加载初始数据
            isLoadingMore: false, // 是否正在加载更多数据
            isNoMore: false, // 是否没有更多数据
            searchName: "", // 搜索关键字
            isRefreshing: false, // 是否正在刷新数据
            selectedResult: [], // 最终选中的结果
        };
    },
    computed: {
        selectListOptions() {
            const { initMsg, initShowImg, options } = this;
            return {
                height: "280px",
                tipsText: initMsg,
                isTipsImg: initShowImg,
                ...options,
            };
        },
        tbSelectionRow() {
            const { idKey, selectedResult, data } = this;
            return {
                idKey,
                allListData: data,
                selectionList: selectedResult,
            };
        },
        loadMoreConfig() {
            const { error, handleError, errorText, pagination } = this;
            const { isNoMore, isLoadingMore, loadMoreOptions } = this;
            if (pagination) {
                return {};
            }
            return {
                isScroll: true,
                loadShow: isLoadingMore && !handleError(error) ? true : false,
                loadNoMoreText: handleError(error)
                    ? errorText
                    : isNoMore
                    ? "没有更多数据了..."
                    : "",
                ...loadMoreOptions,
            };
        },
        loadingConfig() {
            const { loadingOptions, isLoadingInit, error, handleError } = this;
            return (
                loadingOptions || {
                    loading: isLoadingInit && !handleError(error),
                }
            );
        },
    },
    watch: {
        // 监听弹窗的显隐
        isVisible(newVal) {
            if (newVal) {
                this.loadInit();
            } else {
                this.onClear();
            }
        },
        // 监听传入的所有数据
        data(newVal, oldVal) {
            // 避免 接口响应过快，loading展示消失过快，而导致有白屏闪动的一个效果
            setTimeout(() => {
                this.isLoadingInit = false;
                this.isLoadingMore = false;
            }, 500);

            if (newVal && newVal.length) {
                if (!this.isRefreshing) {
                    this.isNoMore = newVal.length == oldVal.length;
                } else {
                    this.isNoMore = false;
                    this.isRefreshing = false;
                }
            } else {
                this.isNoMore = false;
            }
        },
        // 监听传入的被选中数据
        selectedData: {
            handler: function (newVal, oldVal) {
                this.selectedResult = deepCopy(newVal);
            },
            immediate: true,
        },
    },
    methods: {
        // 加载初始数据
        loadInit() {
            this.isLoadingInit = true;
            this.$emit("loadInit");
        },
        // 加载更多数据
        loadMore() {
            this.isLoadingMore = true;
            this.$emit("loadMore");
        },
        handleCurrentChange(event) {
            this.$emit("current-change", event);
        },
        handleSizeChange(event) {
            this.$emit("size-change", event);
        },
        // 监听搜索框的输入
        onSearchIpt(value) {
            this.searchName = value.trim();
        },
        // 按下搜索框的回车键
        onSearchEnter() {
            this.onRefresh();
            this.$emit("search", this.searchName);
        },
        selectChange(selection) {
            this.selectedResult = selection;
        },
        // 点击删除某一项
        onDelItem(item, index) {
            const { selectedResult } = this;
            selectedResult.splice(index, 1);
        },
        // 点击取消
        onCancel() {
            if (!this.isVisible) return;
            this.$emit("update:isVisible", false);
            // 取消重置
            this.selectedResult = deepCopy(this.selectedData);
            setTimeout(() => {
                this.$emit("cancel");
            }, 500);
        },
        // 点击确定
        onConfirm() {
            this.$emit("confirm", this.selectedResult);
        },
        // 刷新数据
        onRefresh() {
            this.isRefreshing = true;
            this.$refs?.dialogTable?.tableScrollTop(100);
            this.isLoadingInit = true;
        },
        // 清空数据
        onClear() {
            this.searchName = "";
        },
        handleError(error) {
            if (typeof error === "boolean") {
                return error;
            } else if (typeof error === "function") {
                return error();
            }
            return Boolean(error);
        },
        
        /**
         * @description 单元格 hover 进入时触发的事件
         */
        handleCellMouseEnter(row, column, cell, event) {
            this.$emit('cell-mouse-enter', row, column, cell, event)
        },
        /**
         * @description 单元格 hover 退出时触发的事件
         */
        handleCellMouseLeave(row, column, cell, event) {
            this.$emit('cell-mouse-leave', row, column, cell, event)
        },
        /**
         * @description 单元格点击时触发的事件
         */
        handleCellClick(row, column, cell, event) {
            this.$emit('cell-click', row, column, cell, event)
        },
        /**
         * @description 单元格双击时触发的事件
         */
        handleCellDblclick(row, column, cell, event) {
            this.$emit('cell-dblclick', row, column, cell, event)
        },
        /**
         * @description 行点击时触发的事件
         */
        handleRowClick(row, event, column) {
            this.$emit('row-click', row, event, column)
        },
        /**
         * @description 行右键点击时触发的事件
         */
        handleRowContextmenu(row, event) {
            this.$emit('row-contextmenu', row, event)
        },
        /**
         * @description 行双击时触发的事件
         */
        handleRowDblclick(row, event) {
            this.$emit('row-dblclick', row, event)
        },
        /**
         * @description 表头点击时触发的事件
         */
        handleHeaderClick(column, event) {
            this.$emit('header-click', column, event)
        },
        /**
         * @description 表头右键点击时触发的事件
         */
        handleHeaderContextmenu(column, event) {
            this.$emit('header-contextmenu', column, event)
        },
        /**
         * @description 排序状态
         */
        handleSortChange({ column, prop, order }) {
            const dialogTable = this.$refs.dialogTable || null;
            this.$emit('sort-change', { column, prop, order, ref: dialogTable })
        },
    },
};
</script>

<style src="./SelectListPopup.less" lang="less"></style>
