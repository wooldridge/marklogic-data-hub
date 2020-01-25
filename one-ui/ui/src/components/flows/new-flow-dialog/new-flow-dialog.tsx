import { Modal, Form, Input, Button, Tooltip, Icon, Progress, Upload, Select } from "antd";
import React, { useState, useEffect } from "react";
import styles from './new-flow-dialog.module.scss';
import {NewFlowTooltips} from '../../../config/tooltips.config';

const NewFlowDialog = (props) => {

  const [flowName, setFlowName] = useState('');
  const [description, setDescription] = useState(props.flowData && props.flowData != {} ? props.flowData.description : '');

  const [isFlowNameTouched, setFlowNameTouched] = useState(false);
  const [isDescriptionTouched, setDescriptionTouched] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // if (props.flowData && JSON.stringify(props.flowData) != JSON.stringify({}) && props.title === 'Edit Flow') {
    //   setFlowName(props.stepData.name);
    //   setDescription(props.stepData.description);
    //   setIsLoading(true);
    // } else {
      setFlowName('');
      setFlowNameTouched(false);
      setDescription('');
    //}

    return (() => {
      setFlowName('');
      setFlowNameTouched(false);
      setDescription('');
    })

  }, [props.title, props.newFlow]);

  const onCancel = () => {
    props.setNewFlow(false);
  }

  const onOk = () => {
    props.setNewFlow(false);
  }

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    if (event) event.preventDefault();

    let dataPayload = {
        name: flowName,
        description: description
      }
    setIsLoading(true);

    //Call create data load artifact API function
    props.createFlow(dataPayload);

    props.setNewFlow(false);
  }

  const handleChange = (event) => {
    if (event.target.id === 'name') {
      if (event.target.value === ' ') {
        setFlowNameTouched(false);
      }
      else {
        setFlowNameTouched(true);
        setFlowName(event.target.value);
      }
    }
    if (event.target.id === 'name' && event.target.value.length == 0) {
      console.log('setIsLoading(false);');
      setIsLoading(false);
    }

    if (event.target.id === 'description') {
      setDescription(event.target.value)
    }
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 15 },
    },
  };

  return (<Modal visible={props.newFlow}
    title={null}
    width="700px"
    onCancel={() => onCancel()}
    onOk={() => onOk()}
    okText="Save"
    className={styles.modal}
    footer={null}>

    <p className={styles.title}>{props.title}</p>
    <br />
    <div className={styles.newFlowForm}>
      <Form {...formItemLayout} onSubmit={handleSubmit} colon={false}>
        <Form.Item label={<span>
          Name:&nbsp;<span className={styles.asterisk}>*</span>&nbsp;
              <Tooltip title={NewFlowTooltips.name}>
            <Icon type="question-circle" className={styles.questionCircle} theme="filled" />
          </Tooltip>
          &nbsp;
            </span>} labelAlign="left"
          validateStatus={(flowName || !isFlowNameTouched) ? '' : 'error'}
          help={(flowName || !isFlowNameTouched) ? '' : 'Name is required'}>
          <Input
            id="name"
            placeholder="Enter name"
            value={flowName}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label={<span>
          Description:&nbsp;
              <Tooltip title={NewFlowTooltips.description}>
            <Icon type="question-circle" className={styles.questionCircle} theme="filled" />
          </Tooltip>
          &nbsp;
            </span>} labelAlign="left">
          <Input
            id="description"
            placeholder="Enter description"
            value={description}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item className={styles.submitButtonsForm}>
          <div className={styles.submitButtons}>
            <Button onClick={() => onCancel()}>Cancel</Button>
            &nbsp;&nbsp;
            <Button 
              type="primary" 
              htmlType="submit" 
              disabled={!flowName}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  </Modal>)
}

export default NewFlowDialog;
