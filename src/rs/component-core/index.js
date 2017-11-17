import React, {PureComponent} from 'react';

const component = {};

/**
 * 注入权限验证
 * @param code
 * @returns {function(*)}
 */
component.injectRole = (code) => {
  return (WrappedComponent) => {
    return class extends PureComponent {
      componentWillMount() {
        const {dispatch} = this.props;
        dispatch({
          type: 'user/validRole',
          payload: {
            roleCode: code,
          },
        });
      }

      render() {
        return <WrappedComponent {...this.props}/>;
      }
    };
  };
};

/**
 * 注入模型
 * @param model
 * @returns {function(*)}
 */
component.injectModel = (model) => {
  return (WrappedComponent) => {
    return class extends PureComponent {
      render() {
        const {dispatch} = this.props;
        const _model = {
          name: model,
          call: (type, payload) => {
            return dispatch({
              type: `${model}/${type}`,
              payload,
            });
          },
          dispatch: ({type, payload}) => {
            return dispatch({
              type: `${model}/${type}`,
              payload,
            });
          },
          setState: (payload) => {
            return dispatch({
              type: `${model}/setState`,
              payload,
            });
          },
        }
        return <WrappedComponent model={_model} {...this.props}/>;
      }
    };
  };
};

/**
 * 注入分页
 * @param model
 * @returns {function(*)}
 */
component.injectPagination = ({model}) => {
  return (WrappedComponent) => {
    return class extends PureComponent {
      render() {
        const {dispatch} = this.props;
        const pagination = ({total, pageIndex}, action) => {
          return {
            showSizeChanger: true,
            showTotal: (value) => {
              return `共 ${value}条数据`;
            },
            total,
            current: pageIndex,
            pageSize: localStorage.getItem('pageSize') === null ? 10
              : parseInt(localStorage.getItem('pageSize')),
            onChange: (current) => {
              dispatch({
                type: `${model}/setState`,
                payload: {
                  pageIndex: current,
                },
              }).then(() => {
                action();
              });
            },
            onShowSizeChange: (current, size) => {
              localStorage.setItem('pageSize', size);
              dispatch({
                type: `${model}/setState`,
                payload: {
                  pageSize: size,
                  pageIndex: 1,
                },
              }).then(() => {
                action();
              });
            },
          };
        }
        return <WrappedComponent pagination={pagination} {...this.props}/>;
      }
    };
  };
};

component.injectOption = (name, params) => {
  return (WrappedComponent) => {
    return class extends PureComponent {
      componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
          type: `global/${name}`,
          payload: params,
        });
        // WrappedComponent.prototype.componentDidMount();
      }

      render() {
        return <WrappedComponent {...this.props}/>;
      }
    };
  };
};


export default component;
