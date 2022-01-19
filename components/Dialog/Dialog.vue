<!--
 * @Author: CasualMing
 * @Date: 2021-05-10 14:38:41
 * @LastEditTime: 2022-01-07 19:33:51
 * @Description: 基于 element-ui的dialog 二次封装
 * @FilePath: \sinosun-operation-ui\components\Dialog\Dialog.vue
-->

<template>
    <div class="sndialog">
        <el-dialog
            class="common_dialog"
            @close="hide"
            @opened="opened"
            @open="open"
            v-bind="attr"
            :visible.sync="model"
        >
            <template #title>
                <slot name="title">
                    <div
                        class="common_dialog_title"
                        v-if="isShowTitle"
                    >
                        {{ title }}
                        <i
                            class="el-icon-close common_dialog_close"
                            v-if="showClose"
                            @click.stop="handleCloseDialog"
                        ></i>
                    </div>
                </slot>
            </template>
            <template>
                <slot></slot>
            </template>
            <template #footer>
                <slot name="footer">
                    <div
                        class="common_dialog_footer"
                        :class="footerClass"
                        v-if="isShowFooter"
                    >
                        <template v-for="(i,idx ) in footerOptions">
                            <el-button
                                :key="idx"
                                v-bind="i"
                                @click="$emit(i.emit)"
                                v-show="handleShow(i.show,i)"
                                :disabled="handleDisabled(i.disabled,i)"
                            >{{i.text}}</el-button>
                        </template>
                    </div>
                </slot>
            </template>
        </el-dialog>
    </div>
</template>
<script>
const ElButton = () => import("element-ui/lib/button");
const ElDialog = () => import("element-ui/lib/dialog");

import { getClass } from "../../lib/utils/commonUtil";

import Utils from "../Utils";

export default {
    name: "Dialog",
    components: { ElButton, ElDialog },
    mixins: [Utils],
    props: {
        value: {
            type: Boolean,
            default: false,
        }, // 弹框显隐
        title: {
            type: String,
            default: "",
        }, // 弹框标题
        isCenter: {
            type: [Boolean, null],
            default: true,
        }, // 是否居中展示
        styleText: [Object, null],
        width: {
            type: String,
            default: "480px",
        }, // 弹框中间宽度
        isShowFooter: {
            type: Boolean,
            default: true,
        }, // 是否展示弹框按钮操作区
        isShowTitle: {
            type: Boolean,
            default: true,
        }, // 是否展示弹框标题关闭按钮区域
        closeOnClickModal: {
            type: Boolean,
            default: false,
        }, // 是否点击弹框遮罩关闭
        showClose: {
            type: Boolean,
            default: true,
        }, // 是否展示关闭按钮
        mask: {
            type: Boolean,
            default: false,
        }, // 是否展示遮罩
        destroyOnClose: {
            type: Boolean,
            default: true,
        }, // 关闭弹框是否销毁弹框
        footerClass: {
            type: String,
            default: "",
        },
        footerButtons: {
            type: Array,
        },
        cancelOptions: {
            type: [Object, Boolean],
            default: () => {
                return {
                    loading: false,
                };
            },
        }, // 取消按钮的配置
        fixedOptions: {
            type: [Object, Boolean],
            default: () => {
                return {
                    loading: false,
                };
            },
        }, // 确定按钮的配置
        customClass: String,
        beforeClose: Function,
    },
    data() {
        return {};
    },
    model: {
        prop: "value",
        event: "change",
    },
    methods: {
        handleCloseDialog() {
            const { beforeClose } = this;
            if (typeof beforeClose === "function") {
                this.beforeClose(this.hide);
            } else {
                this.hide();
            }
        },
        fixed() {
            this.$emit("fixed");
        },
        cancel() {
            this.$emit("cancel");
        },
        hide() {
            this.model = false;
            this.$emit("close");
        },
        opened() {
            this.$emit("opened");
        },
        open() {
            this.$emit("open");
        },
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(newValue) {
                this.$emit("change", newValue);
            },
        },
        attr() {
            const { isCenter, styleText, width, mask } = this;
            const { closeOnClickModal, destroyOnClose, customClass, $attr } =
                this;
            return {
                style: isCenter ? { zIndex: 2100 } : styleText,
                class: isCenter ? "" : "common_dialog_follow",
                width,
                showClose: false,
                modal: mask,
                closeOnClickModal,
                destroyOnClose,
                customClass,
                ...$attr,
            };
        },
        footerOptions() {
            const { cancelOptions, fixedOptions, footerButtons } = this;
            const cancelObj =
                getClass(cancelOptions) === "Boolean"
                    ? {
                          loading: cancelOptions,
                      }
                    : cancelOptions;
            const fixedObj =
                getClass(fixedOptions) === "Boolean"
                    ? {
                          loading: fixedOptions,
                      }
                    : fixedOptions;
            return (
                footerButtons || [
                    {
                        text: " 取 消 ",
                        type: "default",
                        emit: "cancel",
                        ...cancelObj,
                    },
                    {
                        text: "确 定",
                        type: "primary",
                        emit: "fixed",
                        ...fixedObj,
                    },
                ]
            );
        },
    },
};
</script>
<style lang="less">
@import url("./Dialog.less");
</style>