import React, { Component} from "react"

class CompanyRelatedPartyBar extends Component {
    render(){
        return (
            <div className="company-related-party-bar">
                关联方：<span>{ this.props.children }</span>
            </div>
        )
    }
}

export default CompanyRelatedPartyBar;