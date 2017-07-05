/*
* App挂载
* */
import React from "react"
import { render } from "react-dom"
import Router from "./Router"

// 所有待销毁的echarts实例
window.allEcharts = [];

render(
    <Router></Router>,
    document.getElementById('app')
)