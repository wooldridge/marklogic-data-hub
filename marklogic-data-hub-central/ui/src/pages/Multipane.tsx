import React, { useState } from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import { Tooltip } from 'antd';
import 'react-mosaic-component/react-mosaic-component.css';
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltRight, faCube, faCubes, faObjectUngroup, faProjectDiagram, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import styles from './Multipane.module.scss';
import './Multipane.css';

import LoadData from './LoadData';
import Modeling from './Modeling';
import EntityTypes from './EntityTypes';
import Bench from './Bench';
import Browse from './Browse';

export type ViewId = 'load' | 'model' | 'curate' | 'run' | 'explore';

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
        border: '#520339',
        element: <LoadData/>,
    },
    model: { 
        title: 'Model',
        icon: faCube, 
        color: '#22075E',
        bgColor: '#E6EBF4',
        border: '#003A8C',
        element: <Modeling/>,
    },
    curate: { 
        title: 'Curate',
        icon: faObjectUngroup, 
        color: '#FFC53D',
        bgColor: '#F8F2E8',
        border: '#BC811D',
        element: <EntityTypes/>,
    },
    run: { 
        title: 'Run',
        icon: faCubes, 
        color: '#D61178',
        bgColor: '#E6E7F2',
        border: '#061178',
        element: <Bench/>,
    },
    explore: { 
        title: 'Explore',
        icon: faProjectDiagram, 
        color: '#00474F',
        bgColor: '#E6EDED',
        border: '#00474F',
        element: <Browse/>,
    },
};

const INITIAL_SELECTION = 'load';
const INITIAL_NODE = 'load';

const Multipane: React.FC  = (props) => {
    const [selection, setSelection] = useState<ViewId>(INITIAL_SELECTION);
    const [currentNode, setCurrentNode] = useState<any>(INITIAL_NODE);

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
                    <i aria-label={'icon-' + viewId}>
                        <FontAwesomeIcon style={{color: VIEW_MAP[viewId]['color']}} icon={VIEW_MAP[viewId]['icon']} /> 
                    </i>
                    <label className={styles.text}>{props.title}</label>
                </div>
                <div className={styles.actions}>
                    <Tooltip title={'Open in New Tab'} placement="bottom">
                        <i className={styles.fa} aria-label={'new-tab'} onClick={onClickNewTab}>
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </i>
                    </Tooltip>
                    <Tooltip title={'Maximize'} placement="bottom">
                        <i className={styles.ant} aria-label={'maximize'} onClick={onClickMaximize}>
                            <ArrowsAltOutlined />
                        </i>
                    </Tooltip>
                    <Tooltip title={'Minimize'} placement="bottom">
                        <i className={styles.ant} aria-label={'minimize'} onClick={onClickMinimize}>
                            <ShrinkOutlined />
                        </i>
                    </Tooltip>
                </div>
            </div>
        )
    };

    return (
        <>
            <div id={styles.toolbar}>
                {Object.keys(VIEW_MAP).map((tool, i) => {
                    return (
                        <Tooltip title={VIEW_MAP[tool]['title']} placement="left" key={i}>
                            <i className={styles.tool} aria-label={'tool-' + tool} style={{color: VIEW_MAP[tool]['color']}} onClick={() => onSelect(tool)}>
                                <FontAwesomeIcon icon={VIEW_MAP[tool]['icon']} size="lg" />
                            </i>
                        </Tooltip>
                    )
                })}
            </div>
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
            </div>
        </>
    );
}

export default Multipane;
