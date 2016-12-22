'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import {Constance} from '../component/constance';

class DebugPage extends React.Component {
    constructor(props) {
        super(props);
        this.developer = this.props.developer;
        this.subProduct = this.props.subProduct;
        this.testFile = this.props.testFile;
        this.state = {
            onlined: this.props.onlined
        };
        this.online = this.online.bind(this);
    }

    online(e) {
        this.setState({onlined: 2}); // onlining
        Axios.get('/admin/onlinecodeconfig', {
            params: {
                developer: this.developer,
                subProduct: this.subProduct
            }
        })
        .then(res => {
            if (res.data.code === 0) {
                this.setState({onlined: 1});
            } else {
                alert(res.data.message);
            }
        })
        .catch(function (err) {
            throw err;
        });
    }

    render() {
        let UA = navigator.userAgent;
        if (!(UA.indexOf('Android') > -1 || UA.indexOf('Linux') > -1)) {
            let warnning = '您的浏览器不是android模式，无法预览效果。请将浏览器设置成android模式，并重新刷新页面。';
            document.body.innerHTML = '<div style="margin: 30px auto; width:500px; color: red">' + warnning + '</div>';
            return false;
        }
        const btnStyle = {
            backgroundColor: '#00c0ef',
            borderColor: '#00acd6',
            color: '#fff',
            fontWeight: 'bold',
            padding: '5px 5px'
        };
        const spanStyle = {
            fontWeight: 'bold',
            color: '#006400'
        };
        const debugPage = Constance.DEBUG_PAGE_PREFIX + '?file=' + this.testFile;
        let res = <button style={btnStyle} onClick={this.online} type='button' title='上线确认'>
            确认上线
            </button>;
        if (this.state.onlined === 1) {
            res = <span style={spanStyle}>已上线，查看线上debug页面点击<a href={debugPage}>这里</a></span>;
        } else if (this.state.onlined === 2) {
            res = <span style={spanStyle}>上线中，请勿走开...</span>;
        }
        return res;
    }
}

ReactDOM.render(
    <DebugPage developer={developer} subProduct={subProduct} onlined={onlined} testFile={testFile} />,
    document.getElementById('onlineDiv')
);
