import React, { useState, CSSProperties } from 'react';
import { Collapse, Button, Icon, Card, Tooltip, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import NewFlowDialog from './new-flow-dialog/new-flow-dialog';
import sourceFormatOptions from '../../config/formats.config';
import styles from './flows.module.scss';

const { Panel } = Collapse;

interface Props {
    data: any;
    deleteFlow: any;
    createFlow: any;
    runStep: any;
}

function callback(key) {
    console.log(key);
}

const Flows: React.FC<Props> = (props) => {
    const [newFlow, setNewFlow] = useState(false);
    const [title, setTitle] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [flowName, setFlowName] = useState('');

    const OpenAddNewDialog = () => {
        setTitle('New Flow');
        setNewFlow(true);
    }

    //Custom CSS for source Format
    const sourceFormatStyle = (sourceFmt) => {
        let customStyles: CSSProperties = {
            float: 'left',
            backgroundColor: (sourceFmt.toUpperCase() === 'XML' ? sourceFormatOptions.xml.color : (sourceFmt.toUpperCase() === 'JSON' ? sourceFormatOptions.json.color : (sourceFmt.toUpperCase() === 'CSV' ? sourceFormatOptions.csv.color : sourceFormatOptions.default.color))),
            fontSize: '12px',
            borderRadius: '50%',
            //width: 'min-content',
            textAlign: 'left',
            color: '#ffffff',
            padding: '5px'
        }
        return customStyles;
    }

    const handleFlowDelete = (name) => {
        setDialogVisible(true);
        setFlowName(name);
    }

    const onOk = (name) => {
        props.deleteFlow(name)
        setDialogVisible(false);
    }

    const onCancel = () => {
        setDialogVisible(false);
    }  

    const deleteConfirmation = (
        <Modal
            visible={dialogVisible}
            okText='Yes'
            okType='danger'
            cancelText='No'
            onOk={() => onOk(flowName)}
            onCancel={() => onCancel()}
            width={350}
        >
            <span style={{fontSize: '16px'}}>Are you sure you want to delete this?</span>
        </Modal>
    );

    const deleteIcon = (name) => (
        <span className={styles.deleteFlow}>
            <Tooltip 
                title={'Delete'} 
                placement="bottom"
            >
                <i>
                    <FontAwesomeIcon 
                        icon={faTrashAlt} 
                        onClick={event => {
                            // If you don't want click extra trigger collapse, you can prevent this:
                            event.stopPropagation();
                            handleFlowDelete(name);
                        }}
                        className={styles.deleteIcon} 
                        size="lg"/>
                </i>
            </Tooltip>
        </span>
    );

    let panels;
    if (props.data) {
        panels = props.data.map((flow, i) => {
            let name = flow.name;
            let indexes = Object.keys(flow.steps);
            let cards = indexes.map((i) => {
                let step = flow.steps[i];
                // TODO Handle steps that don't have input formats
                let stepFormat = (step.fileLocations) ?  step.fileLocations.inputFileType : 'json';
                return (
                    <Card 
                        style={{ width: 300, marginRight: 20 }} 
                        title={step.stepDefinitionType} 
                        size="small"
                        extra={
                            <div className={styles.actions}>
                                <div className={styles.run} onClick={() => props.runStep(step.name)}><Icon type="play-circle" theme="filled" /></div>
                                <div className={styles.delete}><Icon type="close" /></div>
                            </div>
                        }
                    >
                        <div className={styles.cardContent}>
                            <div className={styles.format} style={sourceFormatStyle(stepFormat)}>{stepFormat.toUpperCase()}</div>
                            <div className={styles.name}>{step.name}</div>
                        </div>
                    </Card>
                )
            });
            return (
                <Panel header={flow.name} key={i} extra={deleteIcon(name)}>
                    <div className={styles.panelContent}>
                        {cards}
                    </div>
                </Panel>
            )
        })
    }

   return (
    <div className={styles.flowsContainer}>
        <div className={styles.createContainer}>
            <Button className={styles.createButton} type="primary" onClick={OpenAddNewDialog}>Create Flow</Button>
        </div>
        <Collapse 
            onChange={callback}
            className={styles.collapseFlows}
        >
            {panels}
        </Collapse>
        <NewFlowDialog newFlow={newFlow} title={title} setNewFlow={setNewFlow} createFlow={props.createFlow}/>
        {deleteConfirmation}
    </div>
   );
}

export default Flows;
