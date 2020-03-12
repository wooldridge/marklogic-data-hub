import React, { useContext, useState, useEffect } from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import styles from './Multipane.module.scss';
import 'react-mosaic-component/react-mosaic-component.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faLongArrowAltRight, faCube, faCubes, faObjectUngroup, faProjectDiagram,
        faExpandArrowsAlt, faCompressArrowsAlt, faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
import './Multipane.css';

import {
    SplitCellsOutlined,
} from '@ant-design/icons';

import LoadData from './LoadData';
import Modeling from './Modeling';
import EntityTypes from './EntityTypes';
import Bench from './Bench';
import Browse from './Browse';

//import { MosaicWindowContext, MosaicContext } from 'react-mosaic-component/src';

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

const onClickSplit = (event) => {
    console.log('Split clicked!', event);
}

const onClickClose = (event) => {
    console.log('Close clicked!', event);
}

// let initialNode = {
//     direction: 'column',
//     first: {
//         direction: 'row',
//         first: 'LoadData',
//         second: 'EntityTypes',
//     },
//     second: 'Bench',
// }

let initialNode = 'load';

const Multipane: React.FC  = (props) => {
    //const { mosaicId } = useContext(MosaicContext);
    const [selection, setSelection] = useState<ViewId>('load');
    const [currentNode, setCurrentNode] = useState<any>(initialNode);

    const onSelect = (itm) => {
        setSelection(itm);
        update(itm);
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

    const onClickToolbar = (event) => {
        console.log('onClickToolbar', event);
    }

    const getToolbar = function (items) {
        let menu = items.map((itm, i) => {
            return (
                <div className={styles.item} role={'item-' + itm} style={{color: VIEW_MAP[itm]['color']}} onClick={() => onSelect(itm)}>
                    <FontAwesomeIcon icon={VIEW_MAP[itm]['icon']} size="lg" />
                </div>
            )
        });
        return menu;
    };

    const getPaneHeader = function (props, draggable) {
        let viewId: any = null;
        Object.keys(VIEW_MAP).forEach(key => {
            if (VIEW_MAP[key]['title'] === props.title) {
                viewId = key;
            }
        });
        return (
            <div className={styles.paneHeader} style={{backgroundColor: VIEW_MAP[viewId]['bgColor'], borderBottomColor: VIEW_MAP[viewId]['border']}} onClick={onClickToolbar}>
                <div className={styles.title}>
                    <FontAwesomeIcon style={{color: VIEW_MAP[viewId]['color']}} icon={VIEW_MAP[viewId]['icon']} size="lg" /> 
                    <span className={styles.text}>{props.title}</span>
                </div>
                <div className={styles.icons} onClick={(event) => onClickToolbar}>
                    <div className={styles.icon}>
                        <FontAwesomeIcon icon={faExternalLinkAlt} size="lg" />
                    </div>
                    <div className={styles.icon2}>
                        <ArrowsAltOutlined style={{ fontSize: '24px' }} />
                    </div>
                    <div className={styles.icon2}>
                        <ShrinkOutlined style={{ fontSize: '24px' }} />
                    </div>
                </div>
            </div>
        )
    };

    const getContainerStyle = (id: ViewId) => {
        return 'mosaic-container mosaic-container-' + id;
    };

    return (
        <>
            <div id={styles.toolbar}>
                {getToolbar(Object.keys(VIEW_MAP))}
            </div>
            <div id="multipane" className={styles.multipaneContainer}>
                <Mosaic<ViewId>
                    renderTile={(id, path) => { 
                        return (
                        <MosaicWindow<ViewId> 
                            //className={selected === id ? 'selected' : ''}
                            path={path} 
                            //createNode={() => 'new'} 
                            title={VIEW_MAP[id]['title']}
                            renderToolbar={getPaneHeader}
                        >
                            <h1>{VIEW_MAP[id]['element']}</h1>
                        </MosaicWindow>
                        )
                    }}
                    className={getContainerStyle(selection)}
                    value={currentNode}
                    onChange={onChange}
                    onRelease={onRelease}
                />
            </div>
        </>
    );
}

export default Multipane;
