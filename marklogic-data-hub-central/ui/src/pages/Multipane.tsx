import React, { useContext, useState, useEffect } from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import styles from './Multipane.module.scss';
import 'react-mosaic-component/react-mosaic-component.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { Icon } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faLongArrowAltRight, faCube, faCubes, faObjectUngroup, faProjectDiagram,
        faWindowMaximize, faWindowMinimize, faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";

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
    element: JSX.Element;
}

const VIEW_MAP: Record<ViewId, ViewItem>  = {
    load: { 
        title: 'Load',
        icon: faLongArrowAltRight, 
        color: '#520339',
        element: <LoadData/>,
    },
    model: { 
        title: 'Model',
        icon: faCube, 
        color: '#22075E',
        element: <Modeling/>,
    },
    curate: { 
        title: 'Curate',
        icon: faObjectUngroup, 
        color: '#FFC53D',
        element: <EntityTypes/>,
    },
    run: { 
        title: 'Run',
        icon: faCubes, 
        color: '#D61178',
        element: <Bench/>,
    },
    explore: { 
        title: 'Explore',
        icon: faProjectDiagram, 
        color: '#00474F',
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
    const [currentNode, setCurrentNode] = useState<any>(initialNode);

    const onSelect = (itm) => {
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

    const toolbar = function (props, draggable) {
        let viewId: any = null;
        Object.keys(VIEW_MAP).forEach(key => {
            if (VIEW_MAP[key]['title'] === props.title) {
                viewId = key;
            }
        });
        return (
            <div id={viewId} style={{backgroundColor: VIEW_MAP[viewId]['color']}} className={styles.toolbar} onClick={onClickToolbar}>
                <div className={styles.title}>
                    <FontAwesomeIcon icon={VIEW_MAP[viewId]['icon']} size="lg" /> 
                    <span className={styles.text}>{props.title}</span>
                </div>
                <div className={styles.icons} onClick={(event) => onClickToolbar}>
                    <div className={styles.icon}>
                        <FontAwesomeIcon icon={faExternalLinkAlt} size="lg" />
                    </div>
                    <div className={styles.icon}>
                        <FontAwesomeIcon icon={faWindowMinimize} size="lg" />
                    </div>
                    <div className={styles.icon}>
                        <FontAwesomeIcon icon={faWindowMaximize} size="lg" />
                    </div>
                </div>
            </div>
        )
    };

    const getMenu = function (items) {
        let menu = items.map((itm, i) => {
            return (
                <div className={styles.item} style={{color: VIEW_MAP[itm]['color']}} id={itm} role={itm} onClick={() => onSelect(itm)}>
                    <FontAwesomeIcon icon={VIEW_MAP[itm]['icon']} size="lg" />
                </div>
            )
        });
        return menu;
    };

    return (
        <div id="multipane" className={styles.multipaneContainer}>
            <div id={styles.menu}>
                {getMenu(Object.keys(VIEW_MAP))}
            </div>
            <Mosaic<ViewId>
                renderTile={(id, path) => { 
                    return (
                    <MosaicWindow<ViewId> 
                        //className={selected === id ? 'selected' : ''}
                        path={path} 
                        //createNode={() => 'new'} 
                        title={VIEW_MAP[id]['title']}
                        // UNCOMMENT THE BELOW TO SHOW CUSTOM TOOL ICONS
                        renderToolbar={toolbar}
                    >
                        <h1>{VIEW_MAP[id]['element']}</h1>
                    </MosaicWindow>
                    )
                }}
                value={currentNode}
                onChange={onChange}
                onRelease={onRelease}
            />
        </div>
    );
}

export default Multipane;
