import React, { Component } from "react"
import { observable, computed } from "mobx"
import { observer } from "mobx-react"

import './Test.scss'

@observer
class Test extends Component {

    arrBack = [
    '111',
    '112',
    '122',
    '211',
    '212'
]
    @observable arr = []
    @observable input = '2020'

    constructor () {
        super()

        this.arr = this.arrBack

        this.handleChange = e => {
            const value = e.target.value
            this.input = value
            this.arr = this.arrBack.filter(item => {
                return item.includes(value)
            })
        }
    }

    @computed get aa () {
        return this.input * 1010
    }

    render () {
        return (
            <div className="test_root">
                <input
                    className="test_input"
                    type="text"
                    placeholder="react"
                    onChange={this.handleChange}
                />
                <ul className="test_list">
                    {
                        this.arr.map((item, index) => <li key={index} className="test_item">{item}</li>)
                    }

                </ul>
                <div className={this.aa}></div>
            </div>
        )
    }
}

export default Test