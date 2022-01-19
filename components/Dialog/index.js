/*
 * @Author: CasualMing
 * @Date: 2021-01-19 16:12:18
 * @LastEditTime: 2022-01-05 10:08:14
 * @Description: 注册为vue插件
 */
import Dialog from './Dialog.vue';

Dialog.install = Vue => Vue.component(Dialog.name, Dialog);

export default Dialog;