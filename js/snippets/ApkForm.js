/**
 * @file
 * @author chenkang02 <chenkang02@baidu.com>
 */

'use strict';
import React from 'react';
import Axios from 'axios';

class ApkForm extends React.Component {
    constructor(props) {
        super(props);
        this.schema = props.schema;
        this.apkUploadApi = props.apkUploadApi;
        this.data = props.data;
        this.lang = 'zh';
        this.onChange = this.onChange.bind(this);
    }

    getClassName(classNames) {
        let styles = this.props.options.styles || {};
        return classNames.split(' ').reduce((c, className) => {
            return `${c ? c + ' ' : ''}${className}${styles[className] ? ` ${styles[className]}` : ''}`;
        }, '');
    }

    getData() {
        let data = {};
        Object.keys(this.schema.properties).map(key => {
            if (key !== 'uploadApk') {
                data[key] = document.getElementById(key).value;
            } else {
                data[key] = document.getElementById(key).files[0]['name'];
            }
        });
        console.log(data);
        return data;
    }

    onChange(e) {
        if (e.target.type === 'checkbox') {
            e.target.checked ? e.target.previousElementSibling.type='file' : e.target.previousElementSibling.type='text';
        } else if (e.target.type === 'file') {
            console.log(e.target.files[0]);
            // 调用接口上传
            if (e.target.files[0] && this.apkUploadApi) {
                let formData = new FormData();
                formData.append('apkFile', e.target.files[0]);
                let config = {
                    onUploadProgress: function(progressEvent) {
                        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        console.log('upload ' + percentCompleted);
                    }
                };
                Axios.post(this.apkUploadApi, formData, config)
                .then(res => {
                    console.log(res);
                    if (res.data.code === 0) {
                        console.log('上传成功!');
                    } else {
                        alert('上传失败!');
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            } else {
                alert('not upload!');
            }
        }
    }

    loadSchema(name) {
    }

    getLabel(key) {
        return this.schema.properties ? this.schema.properties[key].label[this.lang] : '';
    }

    render() {
        const inputStyle = {
            display: 'inline-block'
        };
        return <div className={this.getClassName('schema-form')}>
            {this.schema.properties
            ? Object.keys(this.schema.properties).map(key => {
                return <div key={key} className={this.getClassName('schema-object')}>
                    <label className={this.getClassName('schema-base')}>
                        <span className={this.getClassName('schema-name')}>{this.getLabel(key)}:</span>
                        {this.schema.properties[key].enumLabel 
                                ? <select id={key} className={this.getClassName("schema-input schema-enum")}
                                        onChange={this.onChange} defaultValue={(this.data && this.data.country) ? this.data.country : 'global'}>
                                {this.props.options.schemas['Country'].enums.map(item => {
                                    let value = item.value;
                                    let label = item.label[this.lang];
                                    label = this.schema.properties[key].enumLabel
                                        .replace('${value}', value)
                                        .replace('${label}', label || '?');
                                    return <option key={value} value={value}>{label}</option>;
                                }
                                )}
                                  </select>
                                : (key === 'uploadApk' ? <span>
                                        <input id={key} onChange={this.onChange} style={inputStyle} className={this.getClassName('schema-input schema-string')} type='text'/>
                                        <input className={this.getClassName("schema-bool")}
                                            type="checkbox" onChange={this.onChange}/>
                                        <span className={this.getClassName("schema-name")}>上传方式</span>
                                    </span>
                                : <span>
                                   <input id={key} type='text' className={this.getClassName('schema-input schema-string')} />
                                 </span>)}
                    </label>
                    </div>;
            })
            : ''}
            </div>;
    }
}

export {
    ApkForm
};
