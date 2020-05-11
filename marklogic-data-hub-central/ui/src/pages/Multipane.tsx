import React, { useState } from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import { Tooltip } from 'antd';
import 'react-mosaic-component/react-mosaic-component.css';
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltRight, faCube, faCubes, faObjectUngroup, faProjectDiagram, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import styles from './Multipane.module.scss';
import './Multipane.scss';

import LoadData from './LoadData';
import Modeling from './Modeling';
import EntityTypes from './EntityTypes';
import Bench from './Bench';
import Browse from './Browse';


export type ViewId =  'load' | 'model' | 'curate' | 'run' | 'explore';
export type Control = 'newTab' | 'maximize' | 'minimize';

interface ViewItem {
    title: string;
    icon: any;
    color: string;
    bgColor: string;
    border: string;
    element: JSX.Element;
}

const VIEW_MAP: Record<ViewId, ViewItem>  = {
    load: { 
        title: 'Load',
        icon: faLongArrowAltRight, 
        color: '#520339',
        bgColor: '#EEE6EB',
        border: '#a8819c',
        element: <LoadData/>,
    },
    model: { 
        title: 'Model',
        icon: faCube, 
        color: '#22075E',
        bgColor: '#E6EBF4',
        border: '#7f9cc5',
        element: <Modeling/>,
    },
    curate: { 
        title: 'Curate',
        icon: faObjectUngroup, 
        color: '#FFC53D',
        bgColor: '#F8F2E8',
        border: '#dcbd8a',
        element: <EntityTypes/>,
    },
    run: { 
        title: 'Run',
        icon: faCubes, 
        color: '#061178',
        bgColor: '#E6E7F2',
        border: '#8288bb',
        element: <Bench/>,
    },
    explore: { 
        title: 'Explore',
        icon: faProjectDiagram, 
        color: '#00474F',
        bgColor: '#E6EDED',
        border: '#90aeb2',
        element: <Browse/>,
    },
};

const CONTROLS: Control[]  = []; // TODO Turn on controls: ['newTab', 'maximize', 'minimize']
const INITIAL_SELECTION = ''; // '' for no tile initially

const Multipane: React.FC  = (props) => {
    const [selection, setSelection] = useState<any>(INITIAL_SELECTION);
    const [currentNode, setCurrentNode] = useState<any>(INITIAL_SELECTION);

    const onSelect = (tool) => {
        setSelection(tool);
        update(tool);
    }

    const update = (viewId) => {
        const updatedNode = viewId;
        setCurrentNode(updatedNode);
    }

    const onChange = (event) => {
        console.log('onChange', event);
    }

    const onRelease = (event) => {
        console.log('onRelease', event);
    }

    const onClickNewTab = (event) => {
        console.log('onClickNewTab', event);
    }

    const onClickMaximize = (event) => {
        console.log('onClickMaximize', event);
    }

    const onClickMinimize = (event) => {
        console.log('onClickMinimize', event);
    }

    const renderHeader = function (props) {
        let viewId: string = '';
        // Title is passed in, get the viewId based on it
        Object.keys(VIEW_MAP).forEach(key => {
            if (VIEW_MAP[key]['title'] === props.title) {
                viewId = key;
            }
        });
        return (
            <div 
                className={styles.paneHeader} 
                style={{backgroundColor: VIEW_MAP[viewId]['bgColor'], borderBottomColor: VIEW_MAP[viewId]['border']}}
            >
                <div className={styles.title}>
                    { (viewId === 'explore') ? (
                        <>
                        <span className={'exploreIconHeader'} aria-label={'icon-' + viewId} style={{color: VIEW_MAP[viewId]['color']}}></span>
                        <label className={styles.exploreText}>{props.title}</label>
                        </>
                    ) : (
                        <>
                        <i aria-label={'icon-' + viewId}>
                            <FontAwesomeIcon style={{color: VIEW_MAP[viewId]['color']}} icon={VIEW_MAP[viewId]['icon']} />
                        </i>
                        <label className={styles.text}>{props.title}</label>
                        </>
                    ) }
                </div>
                <div className={styles.controls}>
                    { (CONTROLS.indexOf('newTab') !== -1) ? (
                    <Tooltip title={'Open in New Tab'} placement="bottom">
                        <i className={styles.fa} aria-label={'newTab'} onClick={onClickNewTab}>
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </i>
                    </Tooltip>) : null }
                    { (CONTROLS.indexOf('maximize') !== -1) ? (
                    <Tooltip title={'Maximize'} placement="bottom">
                        <i className={styles.ant} aria-label={'maximize'} onClick={onClickMaximize}>
                            <ArrowsAltOutlined />
                        </i>
                    </Tooltip>) : null }
                    { (CONTROLS.indexOf('minimize') !== -1) ? (
                    <Tooltip title={'Minimize'} placement="bottom">
                        <i className={styles.ant} aria-label={'minimize'} onClick={onClickMinimize}>
                            <ShrinkOutlined />
                        </i>
                    </Tooltip>) : null }
                </div>
            </div>
        )
    };

    return (
        <>
            <div id={styles.toolbar}>
                {Object.keys(VIEW_MAP).map((tool, i) => {
                    if (tool === 'explore') {
                        return (
                            <Tooltip title={VIEW_MAP['explore']['title']} placement="left" key={i}>
                                <div className={'exploreIcon'} aria-label={'tool-' + tool} style={{color: VIEW_MAP[tool]['color']}} onClick={() => onSelect(tool)}></div>
                            </Tooltip>
                        )
                    } else {
                        return (
                            <Tooltip title={VIEW_MAP[tool]['title']} placement="left" key={i}>
                                <i className={styles.tool} aria-label={'tool-' + tool} style={{color: VIEW_MAP[tool]['color']}} onClick={() => onSelect(tool)}>
                                    <FontAwesomeIcon icon={VIEW_MAP[tool]['icon']} size="lg" />
                                </i>
                            </Tooltip>
                        )
                    }
                })}
            </div>

            { (selection !== '') ?  (
            <div id="multipane" className={styles.multipaneContainer}>
                <Mosaic<ViewId>
                    renderTile={(id, path) => { 
                        return (
                            <MosaicWindow<ViewId> 
                                path={path} 
                                title={VIEW_MAP[id]['title']}
                                renderToolbar={renderHeader}
                            >
                                {VIEW_MAP[id]['element']}
                            </MosaicWindow>
                        )
                    }}
                    className={'mosaic-container mosaic-container-' + selection}
                    value={currentNode}
                    onChange={onChange}
                    onRelease={onRelease}
                />
            </div>) : null }
        </>
    );
}

export default Multipane;
