import Message from "element-ui/lib/message";
import "./MessageTip.less";
import { getClass } from '../../lib/utils/commonUtil'

class MessageTip {
    // 默认配置
    options = {
        type: 'info',
        customClass: 'messageTip',
        showClose: true,
        duration: 2000,
        zIndex: 999999
    }

    constructor(result) {
        // 传入配置
        const { options } = result;
        this.options = this.mergeOptions(options);
    }

    mergeOptions(options) {
        const { options: config } = this;
        return options ? {
            ...config,
            ...options
        } : config
    }

    showTosast(params) {
        const defaultConfig = this.mergeOptions(params)
        Message(defaultConfig);
    }

    // 错误类型的提示信息
    showError() {
        const ages = getClass(arguments[0]) === 'Object' ? arguments[0] : { message: arguments[0] };
        this.showTosast({
            type: 'error',
            ...ages
        })
    }

    // 文本类型的提示信息
    showInfo() {
        const ages = getClass(arguments[0]) === 'Object' ? arguments[0] : { message: arguments[0] };

        this.showTosast({
            type: 'info',
            ...ages
        })
    }

    // 成功类型的提示信息
    showSuccess() {
        const ages = getClass(arguments[0]) === 'Object' ? arguments[0] : { message: arguments[0] };

        this.showTosast({
            type: 'success',
            ...ages
        })
    }

    // 警告类型的提示信息
    showWarning() {
        const ages = getClass(arguments[0]) === 'Object' ? arguments[0] : { message: arguments[0] };

        this.showTosast({
            type: 'warning',
            ...ages
        })
    }

    // close() {
    //     Message.close();
    // }
}

export default MessageTip;