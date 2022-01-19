<!--
 * @Author: CasualMing
 * @Date: 2021-03-01 09:05:49
 * @LastEditTime: 2021-12-20 14:02:36
 * @Description: SelectListPopup组件说明文档
-->
## 功能
  + 打开一个弹窗
  + 列表数据懒加载
  + 支持勾选和回显

## 属性
  + isVisible: 弹窗的显隐状态，格式是Boolean，支持.sync修饰符
  + title: 弹窗的标题，格式是String
  + data: 列表的数据，格式是Array，每个数组元素是一个JSON对象
  + total: 列表的总长度，格式是Number
  + selectedData: 需要回显的被选中数据，格式同data
  + columns: 同 `Tabulation` 组件的 `columns` 配置
  + idKey: 每条数据的唯一标识对应的字段名，格式是String，默认是id
  + nameKey: 每条数据的名称对应的字段名，格式是String，默认是name
  + error: 请求报错的时候的处理，当类型为 Function 的时候，返回值必须是 Boolean 类型
  + errorText: 请请求报错的时候展示的文字 默认为 “服务故障，请稍后重试！”
  + isVisibleChoice: 是否展示表格选择之后的结果，格式是Boolean，默认是展示

## 事件
  + loadInit: 打开弹窗，加载初始数据
  + loadMore: 向下滚动，加载更多数据
  + search: 点击搜索按钮，参数的值是搜索的关键字
  + cancel: 点击取消按钮
  + confirm: 点击确认按钮，参数的值是选择的列表数据，格式同data

## 插槽

 + header: 用户使用这个插槽，可以自定义列表头部筛选、搜索区域
 + default: `SelectListPopup` 组件默认的插槽，可以自定义选择表格内的数据之后的展示样式及布局

## 例子

```vue
<template>
    <el-button type="primary" @click="onShow">{{title}}</el-button>
    <SelectListPopup :is-visible.sync="isVisible" :title="title"
        :data="userList" :total="total" :selected-data="selectedUserList" 
        :columns="columns" :id-key="idKey" :name-key="nameKey"
        @loadInit="onLoadInit" @loadMore="onLoadMore" @search="onSearch" @cancel="onCancel" @confirm="onConfirm"
    />
</template>

<script>
import { SelectListPopup } from "sinosun-operation-ui";
import MyApi from "service/MyApi";

export default {
    components: {
        SelectListPopup
    },
    data() {
        return {
            isVisible: false,
            title: "选择人员",
            userList: [],
            total: 0,
            selectedUserList: [],
            columns: [
                {
                    minWidth: "120",
                    label: "用户",
                    label: "userName"
                },
                {
                    minWidth: "120",
                    label: "所属部门",
                    getValue(row) {
                        return row.deptInfo.deptName;
                    }
                },
                {
                    minWidth: "120",
                    label: "所属岗位",
                    getValue(row) {
                        return row.roleList.map((e) => e.roleName).join("，");
                    }
                }
            ],
            idKey: "bizMateId",
            nameKey: "userName",
            searchName: "",
            pageIndex: 1,
            pageSize: 10
        };
    },
    methods: {
        onShow() {
            this.isVisible = true;
        },
        onLoadInit() {
            this.pageIndex = 1;
            this.getUserList().then((res) => {
                if (res.isSuccess()) {
                    const { total, userList } = res.result;
                    this.total = total;
                    this.userList = userList;
                }                  
            });
        },
        onLoadMore() {
            this.pageIndex++;
            this.getUserList().then((res) => {
                if (res.isSuccess()) {
                    const { userList } = res.result;
                    this.userList = this.userList.concat(userList);
                }             
            });
        },
        getUserList() {
            const { searchName, pageIndex, pageSize } = this;
            return MyApi.getUserList(
                searchName,
                pageIndex,
                pageSize
            );
        },
        onSearch(value) {
            this.searchName = value;
            this.onLoadInit();
        },
        onCancel() {
            this.searchName = "";
            this.pageIndex = 1;
            this.userList = [];
        },
        onConfirm(userList) {
            this.selectedUserList = userList;
            this.isVisible = false;
            this.onCancel();
        }
    }
};
</script>
```