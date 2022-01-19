/*
 * @Author: CasualMing
 * @Date: 2021-10-18 15:38:37
 * @LastEditTime: 2021-10-19 09:27:15
 * @Description: 快捷键时间
 * @FilePath: \sinosun-operation-ui\components\DatetimeRangePicker\time.js
 */
/**
 * 获取当前时间，当天从零点零分零秒 ~ 23点59分59秒
 * @date 2021-10-19
 * @returns {Array<Date,Date>}  Array<Date,Date>
 */
export function getToday() {
    const start = new Date(),
        end = new Date();
    start.setHours(0, 0, 0);
    end.setHours(23, 59, 59);
    return [start, end]
}
/**
 * 获取当前时间，昨天天从零点零分零秒 ~ 23点59分59秒
 * @date 2021-10-19
 * @returns {Array<Date,Date>}  Array<Date,Date>
 */
export function getYesterday() {
    const start = new Date(),
        end = new Date();
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0);
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59);
    return [start, end]
}
/**
 * 获取当前时间，当周从周一零点零分零秒 ~ 周末23点59分59秒
 * @date 2021-10-19
 * @returns {Array<Date,Date>}  Array<Date,Date>
 */
export function getWeek() {
    const start = new Date(),
        end = new Date();
    const day = start.getDay();
    start.setDate(start.getDate() - (day == 0 ? 6 : day - 1));
    start.setHours(0, 0, 0);
    end.setDate(end.getDate() + (day == 0 ? 0 : 7 - day));
    end.setHours(23, 59, 59);
    return [start, end]
}
/**
 * 获取当前时间，上周从周一零点零分零秒 ~ 周末23点59分59秒
 * @date 2021-10-19
 * @returns {Array<Date,Date>}  Array<Date,Date>
 */
export function getLastweek() {
    const start = new Date(),
        end = new Date();
    const day = start.getDay();
    start.setDate(start.getDate() - (day == 0 ? 6 : day - 1) - 7);
    start.setHours(0, 0, 0);
    end.setDate(end.getDate() + (day == 0 ? 0 : 7 - day) - 7);
    end.setHours(23, 59, 59);
    return [start, end]
}
/**
 * 获取当前时间，当月从月初一号零点零分零秒 ~ 月末23点59分59秒
 * @date 2021-10-19
 * @returns {Array<Date,Date>}  Array<Date,Date>
 */
export function getMonth() {
    const start = new Date(),
        end = new Date();
    const month = start.getMonth();
    start.setMonth(month, 1);
    start.setHours(0, 0, 0);
    end.setMonth(month + 1, 0);
    end.setDate(end.getDate());
    end.setHours(23, 59, 59);
    return [start, end]
}
/**
 * 获取当前时间，上月月从月初一号零点零分零秒 ~ 月末23点59分59秒
 * @date 2021-10-19
 * @returns {Array<Date,Date>}  Array<Date,Date>
 */
export function getLastmonth() {
    const start = new Date(),
        end = new Date();
    const month = start.getMonth();
    start.setMonth(month - 1, 1);
    start.setHours(0, 0, 0);
    end.setMonth(month, 0);
    end.setHours(23, 59, 59);
    return [start, end]
}
/**
 * 获取当前时间，当年从大年初一零点零分零秒 ~ 当年12月月末23点59分59秒
 * @date 2021-10-19
 * @returns {Array<Date,Date>}  Array<Date,Date>  Array<Date,Date>
 */
export function getYear() {
    const start = new Date(),
        end = new Date();
    const year = start.getFullYear();
    start.setFullYear(year, 0, 1);
    start.setHours(0, 0, 0);
    end.setFullYear(year, 11, 31);
    end.setHours(23, 59, 59);
    return [start, end]
}
/**
 * 获取当前时间，上年从大年初一零点零分零秒 ~ 当年12月月末23点59分59秒
 * @date 2021-10-19
 * @returns {Array<Date,Date>}  Array<Date,Date>
 */
export function getLastyear() {
    const start = new Date(),
        end = new Date();
    const year = start.getFullYear();
    start.setFullYear(year - 1, 0, 1);
    start.setHours(0, 0, 0);
    end.setFullYear(year - 1, 11, 31);
    end.setHours(23, 59, 59);
    return [start, end]
}
/**
 * 根据不同的时间间隔，获取距离当前时间，从零点零分零秒 ~ 23点59分59秒
 * 不包含当前时间的当天
 * @date 2021-10-19
 * @returns {Array<Date,Date>}  Array<Date,Date>
 */
export function getPastTimeByNum(time) {
    const start = new Date(),
        end = new Date();
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59);
    const todayGoTime =
        start.getHours() * 3600 * 1000 +
        start.getMinutes() * 60 * 1000 +
        start.getSeconds() * 1000;

    start.setTime(
        start.getTime() - todayGoTime - 3600 * 1000 * 24 * time
    );
    return [start, end]
}
/**
 * 获取当前时间，过去7天从零点零分零秒 ~ 23点59分59秒
 * 不包含当前时间的当天
 * @date 2021-10-19
 * @returns {Array<Date,Date>}  Array<Date,Date>
 */
export function getPastTimeBy7() {
    return getPastTimeByNum(7);
}
/**
 * 获取当前时间，过去30天从零点零分零秒 ~ 23点59分59秒
 * 不包含当前时间的当天
 * @date 2021-10-19
 * @returns {Array<Date,Date>}  Array<Date,Date>
 */
export function getPastTimeBy30() {
    return getPastTimeByNum(30);
}
/**
 * 获取当前时间，过去60天从零点零分零秒 ~ 23点59分59秒
 * 不包含当前时间的当天
 * @date 2021-10-19
 * @returns {Array<Date,Date>}  Array<Date,Date>
 */
export function getPastTimeBy90() {
    return getPastTimeByNum(90);
}
/**
 * 获取当前时间，过去180天从零点零分零秒 ~ 23点59分59秒
 * 不包含当前时间的当天
 * @date 2021-10-19
 * @returns {Array<Date,Date>}  Array<Date,Date>
 */
export function getPastTimeBy180() {
    return getPastTimeByNum(180);
}