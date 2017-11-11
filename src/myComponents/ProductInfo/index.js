import React from 'react';
import {Modal} from 'antd';
import $ from 'jquery';
import rs from '../../rs/';

class ProductInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      proId: 0,
      smUrl: null,
      bgUrl: null,
      visible: false,
    };
  }


  componentDidMount() {
    this.getImg();
  }

  componentWillReceiveProps(nextProps) {
    this.getImg(nextProps.proId);
  }

  componentWillUnmount() {
  }


  getImg = (proId) => {
    $.ajax({
      type: 'post',
      url: `${rs.config.getConfig('dataApi')}/ProductImg/getProImg`,
      data: {
        proId: proId === undefined ? this.props.proId : proId,
      },
      async: false,
      success: (res) => {
        this.setState({
          smUrl: res.smUrl,
          bgUrl: res.bgUrl,
        });
      },
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
        <img alt="" style={{width: 40, height: 40, cursor: 'pointer'}} src={this.state.smUrl}/>
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
