'use strict';

import React from 'react';

function getLoadSchemaName(loadSchemaOptions, name) {
    return loadSchemaOptions.path.replace(`\${${loadSchemaOptions.property}}`, name);
}

import {loadEnums} from '../../schema'

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.schema = props.schema;
        this.data = props.data;
        this.lang = 'zh';
    }

    getLabel(schema) {
        schema = schema || this.schema;
        return schema.label ? schema.label[this.lang] : (this.props.keyName || '');
    }

    getClassName(classNames) {
        let styles = this.props.options.styles || {};
        return classNames.split(' ').reduce((c, className) => {
            return `${c ? c + ' ' : ''}${className}${styles[className] ? ` ${styles[className]}` : ''}`;
        }, '');
    }

    getData() {
        if (!this.child) {
            return this.data || null;
        }
        return this.child.getData();
    }

    render() {
        return <div className={this.getClassName("schema-form")}>{this.schema.type === 'array'
            ? <ArrayEle
                schema={this.schema}
                options={this.props.options}
                data={this.data}
                ref={child => {this.child = child}}/>
            : (this.schema.type === 'object'
            ? <ObjectEle
                schema={this.schema}
                options={this.props.options}
                data={this.data}
                ref={child => {this.child = child}}/>
            : <BaseEle
                onChange={this.props.onChange}
                schema={this.schema}
                options={this.props.options}
                data={this.data}
                ref={child => {this.child = child}}/>)
        }</div>;
    }
}

class BaseEle extends Form {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        switch (this.schema.type) {
            case 'boolean':
                this.data = !!e.target.checked;
                break;
            default:
                this.data = e.target.value;
        }
        if (this.props.onChange) {
            this.props.onChange(this.data);
        }
    }

    getData() {
        if (this.data === undefined && this.schema.type === 'boolean') {
            return false;
        }
        if (this.data === undefined && this.schema.enums) {
            return (typeof this.schema.enums[0] === 'string') ? this.schema.enums[0] : this.schema.enums[0].value;
        }

        return this.data;
    }

    loadSchema() {
        let s = this.props.options.schemas;
        if (!s || !s[this.schema.loadSchema.path]) {
            throw new Error(`load optional schema error: ${this.schema.loadSchema.path}`);
        }
        s = s[this.schema.loadSchema.path];
        delete this.schema.loadSchema;
        for (let key in s) {
            if (s.hasOwnProperty(key) && !this.schema.hasOwnProperty(key)) {
                this.schema[key] = s[key];
            }
        }
    }

    render() {
        if (this.schema.loadSchema) {
            this.loadSchema();
        }

        switch (this.schema.type) {
            case 'boolean':
                return <label className={this.getClassName("schema-base")}>
                    <span className={this.getClassName("schema-name")}>{this.getLabel()}</span>
                    <input className={this.getClassName("schema-bool")}
                           type="checkbox" defaultChecked={!!this.data} onChange={this.onChange}/>
                </label>;
        }

        if (this.schema.enums) {
            return <label className={this.getClassName("schema-base")}>
                <span className={this.getClassName("schema-name")}>{this.getLabel()}</span>
                <select className={this.getClassName("schema-input schema-enum")}
                        onChange={this.onChange} defaultValue={this.data}>
                    {this.schema.enums.map(item => {
                        let value;
                        let label;
                        if (typeof item === 'string') {
                            value = item;
                            label = item;
                        } else {
                            value = item.value;
                            label = item.label[this.lang];
                        }
                        if (this.schema.enumLabel) {
                            label = this.schema.enumLabel
                                .replace('${value}', value)
                                .replace('${label}', label || '?')
                        }
                        return <option value={value}>{label}</option>;
                    })}
                </select>
            </label>;
        }

        return <label className={this.getClassName("schema-base")}>
            <span className={this.getClassName("schema-name")}>{this.getLabel()}</span>
            <input className={this.getClassName("schema-input schema-string")}
                   type="text" defaultValue={this.data} onChange={this.onChange}/>
        </label>;
    }
}

class ObjectEle extends Form {
    constructor(props) {
        super(props);
        this.state = {};
        if (!this.data) {
            this.data = {};
        }
        this.onLoadSchema = this.onLoadSchema.bind(this);
    }

    getData() {
        this.data = {};
        for (let key in this.state) {
            if (this.state.hasOwnProperty(key)) {
                if (this.state[key].schema.type === 'number') {
                    this.data[key] = Number(this.state[key].getData());
                } else {
                    this.data[key] = this.state[key].getData();
                }
            }
        }
        return this.data;
    }

    loadSchema(name) {
        let schemaOptions = this.props.options.schemas;
        let path = getLoadSchemaName(this.schema.loadSchema, name);
        if (!schemaOptions || !schemaOptions[path]) {
            throw new Error(`load optional schema error: ${name}`);
        }
        let schemaP = schemaOptions[path].properties;
        for (let key in schemaP) {
            if (schemaP.hasOwnProperty(key)) {
                this.schema.properties[key] = schemaP[key];
            }
        }
    }

    onLoadSchema(value) {
        this.data[this.schema.loadSchema.property] = value;
        this.forceUpdate();
    }

    render() {
        let loadSchema = this.schema.loadSchema;
        let loadSchemaName = '';
        if (loadSchema) {
            if (!this.schema.properties[loadSchema.property].enums) {
                throw new Error(`loadSchema.property: "${loadSchema.property}" missing enums`);
            }
            let enumItem0 = this.schema.properties[loadSchema.property].enums[0];
            loadSchemaName = this.data && this.data.hasOwnProperty(loadSchema.property)
                ? this.data[loadSchema.property]
                : (typeof enumItem0 === 'string' ? enumItem0 : enumItem0.value);
            this.loadSchema(loadSchemaName);
        }

        return <div className={this.getClassName(
            `schema-object${loadSchemaName ? ` schema-load-${loadSchemaName}` : ''}`
        )}>
            {this.schema.properties
            ? Object.keys(this.schema.properties).map(key => {
                let onChange = loadSchema && loadSchema.property === key
                    ? this.onLoadSchema
                    : null;

                return <Form key={`${loadSchemaName}\0${key}`}
                             keyName={key}
                             onChange={onChange}
                             schema={this.schema.properties[key]}
                             options={this.props.options}
                             data={this.data ? this.data[key] : null}
                             ref={child => {this.state[key] = child;}}/>;
            })
            : null}
        </div>;
    }
}

class ArrayEle extends Form {
    constructor(props) {
        super(props);
        this.state = {
            items: this.data ? this.data.map((item, i) => {
                return {
                    key: i,
                    data: item,
                    schema: this.schema.items
                };
            }) : []
        };
        this.add = this.add.bind(this);
        this.del = this.del.bind(this);
    }

    getData() {
        return this.data = this.state.items.reduce((r, item) => {
            if (item && item.child) {
                r.push(item.child.getData());
            }
            return r;
        }, []);
    }

    add(e) {
        let i = Number(e.target.parentNode.dataset.i);
        let items = this.state.items;
        let item = {
            key: items.length,
            data: null,
            schema: this.schema.items
        };
        if (i === -1) {
            items.unshift(item);
        } else {
            items = items.slice(0, i + 1).concat(item, items.slice(i + 1));
        }
        this.setState({
            items: items
        });
    }

    del(e) {
        let i = Number(e.target.parentNode.dataset.i);
        this.state.items[i] = null;
        this.setState({
            items: this.state.items
        });
    }

    render() {
        return <ul className={this.getClassName("schema-array")}>
            <li className={this.getClassName("schema-item-action")} data-i={-1} key={-1}>
                <button className={this.getClassName("schema-btn schema-add")} onClick={this.add}>
                    增加{this.getLabel(this.schema.items)}</button>
            </li>
            {this.state.items.map((item, i) => {
                if (!item) {
                    return null;
                }

                return <li className={this.getClassName("schema-item")} data-i={i} key={item.key}>
                    {<Form
                        schema={item.schema}
                        options={this.props.options}
                        data={item.data}
                        ref={child => {item.child = child;}}/>}
                    <button className={this.getClassName("schema-btn schema-add")} title="新增" onClick={this.add}>
                        ＋</button>
                    &nbsp;
                    <button className={this.getClassName("schema-btn schema-del")} title="移除" onClick={this.del}>
                        －</button>
                </li>;
            })}
        </ul>;
    }
}

export {
    Form
};
