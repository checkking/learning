'use strict'

let onlineFilters = {
};
onlineFilters.connection = ["2", "3"];
onlineFilters.country = ["2"];
onlineFilters.isp = [];

let final_str = Object.keys(onlineFilters).reduce(function (pre, key) {
    if (pre !== '') {
        pre += ',';
    }
    let arr_str = '[';
    arr_str += onlineFilters[key].reduce(function (c, val) {
        return c + (c ? ',' : '') + `${val}`;
    }, '');
    arr_str += ']';

    pre += `$${key}: ${arr_str}`;

    return pre;
}, '');

console.log(final_str);
