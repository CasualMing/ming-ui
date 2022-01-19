<!--
 * @Author: CasualMing
 * @Date: 2021-01-19 13:44:29
 * @LastEditTime: 2022-01-17 16:23:26
 * @Description: 文件选择组件
-->
<template>
    <div class="choose-file">
        <label
            class="choose-file_label"
            :class="labelClass"
        > {{ inputLable }} </label>
        <el-input
            :placeholder="inputPlaceholder"
            readonly
            id="importInput"
            ref="importInput"
            :style="{width:inputWidth}"
            :value="isEmpty(fileObj) ? '' : fileObj.name "
            :title="isEmpty(fileObj) ? '' :  fileObj.name "
        >
        </el-input>
        <el-button @click="select">选择文件</el-button>
        <input
            ref="upload"
            :accept="`.${fileExts.join(', .')}`"
            class="file-uploader"
            type="file"
            name="file"
            unselectable="on"
            @change="onChoose($event.currentTarget.files)"
        />
    </div>
</template>

<script>
import { showToast,isEmpty } from "../../lib/utils/commonUtil";
import { getFileContent } from "../../lib/utils/fileUtil";
const ElButton = () => import("element-ui/lib/button");
const ElInput = () => import("element-ui/lib/input");

export default {
    name: "ChooseFile",
    components: { ElButton, ElInput },
    props: {
        fileType: [String, Array], // 文件后缀名
        dataHandler: Function, // 数据处理函数
        errorHandler: Function, // 错误处理函数
        labelClass: String, // 文件上传 label 的类名
        placeholder: String, // 文件选择框提示语
        inputWidth: {
            // 文件选择提示框宽度
            type: String,
            default: "250px",
        },
    },
    data() {
        return {
            fileObj: {}, // 选择的文件对象
        };
    },
    computed: {
        // 可供选择的文件后缀名
        fileExts() {
            const fileType = this.fileType;
            const isArray = Array.isArray(fileType);
            switch (fileType) {
                case "json":
                    return ["json"];
                case "excel":
                    return ["xls", "xlsx"];
                case "word":
                    return ["doc", "docx", "pdf"];
                default:
                    return isArray ? fileType : [fileType];
            }
        },
        inputPlaceholder() {
            const { placeholder, fileExts } = this;
            return placeholder || `支持 .${fileExts.join(", .")} 格式`;
        },
        inputLable() {
            const { label } = this;
            return label || "上传文件";
        },
    },
    methods: {
        isEmpty,
        select() {
            const el = this.$refs.upload;
            if (el._isVue) {
                el.$el.click();
                return false;
            }
            el.click();
        },
        //  点击选择文件
        async onChoose(files) {
            if (files.length) {
                const fileObj = files[0];
                const fileName = fileObj.name;
                const fileExt = fileName.substring(
                    fileName.lastIndexOf(".") + 1
                );

                if (!this.fileExts.includes(fileExt)) {
                    showToast("您选择的文件类型有误!");
                    // 错误处理
                    this.errorHandler && this.errorHandler(fileObj);
                    // 重置内容
                    this.resetIpt();
                    return;
                }
                this.fileObj = fileObj;

                const content = await this.resolveFile().catch((err) => {
                    this.$emit("error", err);
                });
                this.$emit("change", content);
            }
            // 选择完数据，重置input文件选择框，避免二次选择不会触发change 事件
            this.$refs.upload.value = null;
        },
        // 解析文件
        resolveFile() {
            const { fileObj, fileType } = this;

            return getFileContent(fileObj).then((data) => {
                switch (fileType) {
                    case "json":
                        return {
                            fileObj,
                            dataList: data,
                        };
                    case "excel": {
                        // 内部处理：统一将值转换成字符串格式，并去掉首尾空格
                        data.forEach((e) => {
                            if (typeof e == "object") {
                                for (const attr in e) {
                                    e[attr] = !e[attr]
                                        ? ""
                                        : (e[attr] + "").trim();
                                }
                            }
                        });

                        // 外部处理：添加指定的键名
                        const dataList = this.dataHandler
                            ? this.dataHandler(data)
                            : data;

                        // 错误处理
                        let errorList = this.errorHandler
                            ? this.errorHandler(dataList)
                            : []; // 生成
                        errorList = [...new Set(errorList)]; // 去重

                        if (errorList.length) {
                            // 弹框
                            showToast(
                                "第 " + errorList.join(" , ") + " 条数据有误 !"
                            );

                            // 重置
                            this.resetIpt();
                        }

                        return {
                            fileObj,
                            dataList,
                            errorList,
                        };
                    }
                    default:
                        return {
                            fileObj,
                        };
                }
            });
        },
        // 重置输入框
        resetIpt() {
            this.fileObj = {};
            this.$refs.upload.value = "";
        },
    },
};
</script>

<style src="./ChooseFile.less" lang="less"></style>
