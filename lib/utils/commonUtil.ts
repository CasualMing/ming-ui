/*
 * @Author: CasualMing
 * @Date: 2020-12-09 18:38:14
 * @LastEditTime: 2022-01-17 15:30:32
 * @Description: 提供项目中经常用到的公共函数
 */
import { blobToDownload } from './fileUtil';
import BaseRequest from "../NetApi/BaseRequest"

// 生成指定位数的随机字符串
export function randomString(len: number = 32): string {
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * $chars.length));
    }
    return pwd;
}

// 获取url中的参数 
export function getUrlParams(url: string, key?: string): any {
    url = url || window.location.href;
    let regexP = /[^#&\?]+=[^#&\?]*/ig, res = {};
    let ms = url.match(regexP);
    if (ms) {
        for (let i = 0; i < ms.length; i++) {
            let arr = ms[i].split('=');
            res[arr[0]] = decodeURI(arr[1]);
        }
    }
    if (key) {
        return res[key];
    }
    return res;
}

// 长字符省略
export function longCharCut(charName: string, len: number): string {
    if (charName.length > len) charName = charName.substring(0, len) + '...';
    return charName;
}

// html转义
export function htmlEncodeByRegExp(str: string): string {
    if (str.length == 0) return "";
    var s = "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    return s;
}

// 格式化一个JSON对象
export function formatJsonObj(target) {
    const result = {};

    for (const attr in target) {
        if (!/^_\w+_$/.test(attr)) {
            let value = target[attr];

            switch (Object.prototype.toString.call(value)) {
                case "[object Function]":
                    continue;
                case "[object Object]":
                    value = formatJsonObj(value);
                    break;
                case "[object Array]":
                    value = value.map(e => {
                        if (Object.prototype.toString.call(e) == '[object Object]') {
                            return formatJsonObj(e);
                        } else {
                            return e;
                        }
                    });
                    break;
            }

            if (attr[0] == '_') {
                result[attr.substring(1)] = value;
            } else {
                result[attr] = value;
            }
        }
    }

    return result;
}
function formater(fmt, time?) {
    let date = time || this;
    var showDayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "E+": showDayArr[date.getDay()], //  周
        "D+": date.getDate(), // 日
        "H+": date.getHours(), //  小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), //  秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //  季度
        "S": date.getMilliseconds() // 毫秒
    };
    if (/(y+)/i.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}


// 时间格式化
(Date as any).prototype.format = formater
/**
 * 按照指定格式格式化时间
 * @param {String} formater 要格式的格式 默认 yyyy-mm-dd
 * @param {Date} t 要格式的时间，如果不传默认格式化当前时间
 * @param {Boolean} isDecimal  是否是十位
 *  dateFormater('YYYYMMDD') ==> 20200306
 *  dateFormater('YYMMDD') ==> "200306"
 */
export function dateFormat(t, format = 'YYYY-MM-DD', isDecimal = false): string {
    // 是否是IE浏览器
    const isIE = "-ms-scroll-limit" in document.documentElement.style && "-ms-ime-align" in document.documentElement.style;
    const isNumber = getClass(t) === 'Number';
    const isString = getClass(t) === 'String';
    // const isDate = getClass(t) === 'Date';
    // 兼容IE 在进行字符串时间格式化的时候，避免出现NaN操作
    const num = isDecimal
        ? isNumber
            ? t * 1000
            : t
        : t
    const tDate = isIE
        ? isString
            ? new Date(num.replaceAll('-', '/'))
            : new Date(num)
        : new Date(num);
    return formater(format, tDate)
}

// 获取当前函数的节流函数
export function throttle(fn: Function, delay: number = 300): Function {
    let open = true;
    return function () {
        const args = arguments;
        if (open) {
            open = false;
            setTimeout(() => {
                fn.apply(this, args);
                open = true;
            }, delay);
        }
    }
}

// 获取当前函数的防抖函数
export function debounce(fn: Function, delay: number = 400): Function {
    let timer: any = null;
    return function () {
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}

// 获取输入框中光标的位置
export function getCursorPos(target: any): any {
    const isIE = !(!document.all);
    let startIdx = 0, endIdx = 0;

    if (isIE) {
        const sTextRange = (document as any).selection.createRange();
        if (sTextRange.parentElement() == target) {
            const oTextRange = (document as any).body.createTextRange();
            oTextRange.moveToElementText(target);
            for (startIdx = 0; oTextRange.compareEndPoints("StartToStart", sTextRange) < 0; startIdx++) {
                oTextRange.moveStart('character', 1);
            }
            for (let i = 0; i <= startIdx; i++) {
                if (target.value.charAt(i) == '\n') {
                    startIdx++;
                }
            }
            oTextRange.moveToElementText(target);
            for (endIdx = 0; oTextRange.compareEndPoints('StartToEnd', sTextRange) < 0; endIdx++) {
                oTextRange.moveStart('character', 1);
            }
            for (let i = 0; i <= endIdx; i++) {
                if (target.value.charAt(i) == '\n') {
                    endIdx++;
                }
            }
        }
    } else {
        startIdx = target.selectionStart;
        endIdx = target.selectionEnd;
    }

    return { startIdx, endIdx };
}


// 验证用户名
export function checkName(value: string, isStrong: boolean = false): boolean {
    return !isStrong
        ? /^[0-9A-Za-z]{6,20}$/.test(value)
        : /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(value);
}

// 验证密码
export function checkPwd(value: string, isStrong: boolean = false): boolean {
    return !isStrong
        ? /^[0-9A-Za-z]{8,20}$/.test(value)
        : /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$.%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$.%^&*`~()-+=]+$)(?![0-9\W_!@#$.%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#.$%^&*`~()-+=]{8,20}$/.test(value);
}

// 验证邮箱规则
export function checkEmail(value: string): boolean {
    if (value && value != '') {
        var websiteCheck = /(^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$)|(^$)/.test(value);
        if (!websiteCheck) return false;
    }
    return true;
}

// 验证网址的规则
export function checkWebsite(value: string): boolean {
    if (value && value != '') {
        var reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
        if (!reg.test(value)) return false;
    }
    return true;
}

// 弹框提示，过一段时间就会消失
export function showToast(text: string, time: number = 2000) {
    let tipsBox: any = document.querySelector('.tipsBox');
    if (!tipsBox) {
        tipsBox = document.createElement('div');
        tipsBox.className = 'tipsBox';
        tipsBox.innerHTML = `<span>${text}</span>`;
        document.body.appendChild(tipsBox);
    } else if (tipsBox.style.display == 'none') {
        tipsBox.style.display = 'block';
        tipsBox.innerHTML = `<span>${text}</span>`;
    } else {
        clearTimeout((window as any).tipsTimer);
        tipsBox.innerHTML = `<span>${text}</span>`;
    }
    (window as any).tipsTimer = setTimeout(() => {
        tipsBox.style.display = 'none';
    }, time);
}
/**
 * 校验资源url是否可用
 * @param {any} url
 * @param {any} fileName
 * @returns {any}
 */
 export function checkSrc(url: string): Promise<any> {
    const request = new BaseRequest();
    return new Promise((resolve, reject) => {
        request.doGet(url, {}, {dataType: "jsonp"}).then(() => {
            return resolve(true)
        }).catch((err) => {
            return reject(err)
        })
    });
}

/**
 * 下载文件通用方法
 * @param {any} url
 * @param {any} fileName
 */
export function download(url: string, fileName: string): void {
    const origin = location.origin;
    // 不跨域或者文件流直接下载
    if (url.startsWith(origin) || url.startsWith('blob:')) {
        const xhr = new XMLHttpRequest();
        xhr.open("get", url);
        xhr.responseType = "blob";
        xhr.send();
        xhr.onload = function () {
            if (this.status === 200 || this.status === 304) {
                // 获取子路径用于获取文件后缀 IE下的blob无origin信息
                const router = url.split(origin).length > 1 ? url.split(origin)[1] : url;
                const suffix = router.includes('.') ? '.' + router.split('.')[router.split('.').length - 1] : '';
                fileName = fileName.endsWith(suffix) ? fileName : fileName + suffix;
                blobToDownload(this.response, fileName);
            } else {
                showToast("请求错误，请稍后重试", 2000);
            }
        }
    } else {
        // 否则使用a标签下载
        useADownload(url, fileName);
    }
}


/**
 * 根据url 使用a标签下载
 * @date 2021-09-17
 * @param {any} url
 * @param {any} fileName
 * @returns {any}
 */
export function useADownload(url, fileName) {
    // 先检测是否有效
    checkSrc(url).then(() => {
        const a: any = document.createElement('a');
        if ('download' in a) {
            a.href = url;
            a.setAttribute("download", fileName);
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        } else {
            location.href = url; // 兼容不支持 download 属性的
        }
    })
}

// 获取类型名称
export function getClass(target) {
    return (Object as any).prototype.toString.call(target).match(/^\[object\s(.*)\]$/)[1];
}

// 数组去重
export function removedDuplicate(arr: any[], key: string): any[] {
    const newArr: any[] = [], tempArr: any[] = [];
    if (arr.length == 0) {
        return arr;
    } else {
        if (key) {
            for (let i = 0; i < arr.length; i++) {
                if (!tempArr[arr[i][key]]) {
                    newArr.push(arr[i]);
                    tempArr[arr[i][key]] = true;
                }
            }
            return newArr;
        } else {
            for (let i = 0; i < arr.length; i++) {
                if (!tempArr[arr[i]]) {
                    newArr.push(arr[i]);
                    tempArr[arr[i]] = true;
                }
            }
            return newArr;
        }
    }
}

// 判断数组或者对象是否是空白
export function isEmpty(param) {
    const type = getClass(param);
    if (type === 'Array') {
        return param.filter((el) => {
            const type = getClass(el);
            const typeMap = new Map([
                ['String', el],
                ['Object', Object.keys(el).length],
                ['Array', isEmpty(el)],
            ]);
            return typeMap.get(type);
        }).length
    }
    if (type === 'Object') {
        return Object.keys(param).length
    }
    return false
}

/**
 * 深度克隆
 * @date 2021-03-31
 * @param {any} obj 需要克隆的值
 * @param {WeakMap} cache 防止循环引用
 * @returns {any}
 */
export function deepCopy(obj: any, cache = new WeakMap()) {
    if (!(obj instanceof Object)) return obj;
    // 防止循环引用
    if (cache.get(obj)) return cache.get(obj)
    // 支持函数
    if (obj instanceof Function) {
        return function () {
            return obj.apply(this, arguments)
        }
    }
    // 支持日期
    if (obj instanceof Date) return new Date(obj)
    // 支持正则对象
    if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags)
    // 还可以增加其他对象，比如：Map, Set等，根据情况判断增加即可

    // 数组是 key 为数字素银的特殊对象
    const res = Array.isArray(obj) ? [] : {}
    // 缓存 copy 的对象，用于处理循环引用的情况
    cache.set(obj, res)

    Object.keys(obj).forEach((key) => {
        if (obj[key] instanceof Object) {
            res[key] = deepCopy(obj[key], cache)
        } else {
            res[key] = obj[key]
        }
    });
    return res
}

/**
 * @description 对应的元素滚动到顶部，带动画
 * @param {any} distance 每次滚动多少
 */
export function backTop(dom, distance = 50, top = 0) {
    let timer: any = null;
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn() {
        let oTop = dom.scrollTop;
        if (oTop > top) {
            dom.scrollTop = oTop - distance >= 0 ? oTop - distance : top;
            timer = requestAnimationFrame(fn);
        } else {
            cancelAnimationFrame(timer);
        }
    });
}

/**
 * 获取最顶部的window对象
 * @date 2021-03-18
 * @returns {any} window
 */
 export function topWin() {
    var p = window.parent;
    while (p != p.window.parent) {
        p = p.window.parent;
    } return p;
}