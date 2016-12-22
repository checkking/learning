'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ctrResult: false,
            interval: '0'
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleTimeIntervalChange = this.handleTimeIntervalChange.bind(this);
    }

    checkData(data) {
        let errMsg = '';
        if (!(/[a-zA-Z-_]{2,30}/.test(data['license']))) {
            errMsg += 'license 必须是2-30位的字符串'
        }
        if (!/^[a-zA-Z-_]{2,30}$/.test(data['subProduct'])) {
            errMsg += ' subProduct 必须是2-30位的字符串'
        }
        if (!/^[0-9]$/.test(data['interval'])) {
            errMsg += ' 时间间隔必须是0-9之间的一个整数'
        }
        let emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailReg.test(data['email'])) {
            errMsg += ' 邮箱格式不对';
        }

        return errMsg;
    }

    handleSearch(e) {
        /*
        let data = [
            ['----','Click/Show','T540013','T520000','T540014','T540005','T520020','T520021','T520003','T520004','T520022','T540009','T520005','T520017','T540001','T540012'],
            ['ALL','0.0110623','5197.47','600385','3173','1080','4429','1792','517794','5728','6426','31227.4','2476','395734','4970','3588'],
            ['','0','0','600385','','','','','','1','','0','','17167','',''],
            ['cleaner_sex10_design','0.00907475','5062.12','','115','39','146','76','21378','194','224','21931.5','101','15078','171','118']
        ];
        console.log(this);
        this.setState({ctrResult: data});
        */
        let data = this.getData();
        let msg = '';
        if (msg = this.checkData(data)) {
            console.log(msg);
            let errorMsg = document.getElementById('errorMsg');
            let msgHtml = '<span style="color: red; margin-left: 20px;">' + msg + '</span>';
            errorMsg.innerHTML = msgHtml;
            return;
        } else {
            errorMsg.innerHTML = '';
        }
        // post to server

    }

    handleTimeIntervalChange(e) {
        this.setState({interval: e.target.value});
    }

    render() {
        const spanStyle = {
            display: 'inline-block',
            width: '7em',
            fontWeight: 'bold'
        };
        const defaultEmail = 'chenkang02@baidu.com';
        let resultDisplay = '暂无查询结果...';
        if (this.state.ctrResult && this.state.ctrResult.length > 0) {
            let header = this.state.ctrResult[0];
            let resultData = this.state.ctrResult.slice(1);
            resultDisplay = <table className='table'>
                    <tbody>
                        <tr>
                        {header.map(item => <th>{item}</th>)}
                        </tr>
                        {resultData.map(raw => <tr>
                                {raw.map(item => <td>{item}</td>)}
                                </tr>)}
                    </tbody>
                </table>;
        }
        return <div>
            <div className='schema-form'>
                <span style={spanStyle} className='schema-name control-label'>License:</span>
                <input ref={license => {this.license = license;}} className='schema-input form-control schema-string' type='text' />
            </div>
            <div className='schema-form'>
                <span style={spanStyle} className='schema-name control-label'>Sub_Product:</span>
                <input ref={subProduct => {this.subProduct = subProduct;}} className='schema-input form-control schema-string' type='text' />
            </div>
            <div className='schema-form'>
                <span style={spanStyle} className='schema-name control-label'>时间段:</span>
                <input type='radio' 
                        onChange={this.handleTimeIntervalChange}
                        checked={this.state.interval==='0'} 
                        value='0' />当天
                <input type='radio'
                        onChange={this.handleTimeIntervalChange}
                        checked={this.state.interval==='1'}
                        value='1' />半小时内
                <input type='radio' 
                        onChange={this.handleTimeIntervalChange}
                        checked={this.state.interval==='2'}
                        value='2' />一小时内
                <input type='radio' 
                        onChange={this.handleTimeIntervalChange}
                        checked={this.state.interval==='3'}
                        value='3' />两小时内
            </div>
            <div className='sch-form'>
                <span style={spanStyle} className='schema-name control-label'>邮箱:</span>
                <input ref={email => {this.email = email;}} className='schema-input form-control schema-string' type='text' defaultValue={defaultEmail} />
            </div>
            <div className='box-tools'>
                <button onClick={this.handleSearch} type="button"
                        className="btn btn-primary btn-flat" title="Add New Code">
                    查询
                </button>
                <span id='errorMsg'>
                </span>
            </div>
            <div className="box-body no-padding">
                {resultDisplay}
            </div>

        </div>;
    }

    getData() {
        let data = {};
        data['license'] = this.license.value.trim();
        data['subProduct'] = this.subProduct.value.trim();
        data['interval'] = this.state.interval.trim();
        data['email'] = this.email.value.trim();
        return data;
    }
}
ReactDOM.render(
    <Main />,
    document.getElementById('main')
);

