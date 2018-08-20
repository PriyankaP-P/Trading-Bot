"use strict";

const loop_arr =[];

async function loopy (data) {
    for (let i = 0; i < data.length; i++) {
        // console.log(data[i] + "i="+ i)
        loop_arr.push(data[i]);
    }
    return loop_arr;
};

module.exports ={
    loopy
};