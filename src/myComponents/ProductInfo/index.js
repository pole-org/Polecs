import React from 'react';
import {Modal, Spin} from 'antd';
import $ from 'jquery';
import rs from '../../rs/';
import http from '../../utils/http';

class ProductInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      proId: 0,
      smUrl: null,
      bgUrl: null,
      visible: false,
      loading: true,
    };
  }


  componentDidMount() {
    this.getImg();
  }

  getImg = (proId) => {
    http.get(`${rs.config.getConfig('fxApi')}/Product/GetProductImageByID`, {
      productID: proId === undefined ? this.props.proId : proId,
    }).then(res => {
      if (res.model) {
        const data = JSON.parse(res.model);
        this.setState({
          smUrl: data.smUrl,
          bgUrl: data.bgUrl,
          loading: false,
        });
      }
    });
  }

  openModal = () => {
    this.setState({
      visible: true,
    });
  }

  closeModal = () => {
    this.setState({
      visible: false,
    });
  }


  render() {
    return (
      <div onClick={() => this.openModal()}>
        {this.state.loading ?
          <div style={{width: 40, height: 40, margin: 'auto'}}><img src={rs.config.defaultImage} alt="LOADING"/></div> :
          <img alt="" style={{width: 40, height: 40, cursor: 'pointer'}} src={this.state.smUrl}/>
        }
        {this.state.visible ?
          <Modal
            footer={null}
            width={600}
            visible={this.state.visible}
            onCancel={() => this.closeModal()}
          >
            <img alt="" src={this.state.bgUrl} style={{width: 550, height: 500}}/>
          </Modal> : null}
      </div>
    );
  }
}

export default ProductInfo;
