import React, { useContext, useState, useEffect } from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import styles from './Multipane.module.scss';
import 'react-mosaic-component/react-mosaic-component.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faLongArrowAltRight, faCube, faCubes, faObjectUngroup, faProjectDiagram, faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
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

const initialNode = 'load';

const Multipane: React.FC  = (props) => {
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
                <div className={styles.icons}>
                    <i className={styles.fa} aria-label={'new-tab'} onClick={(event) => onClickNewTab}>
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </i>
                    <i className={styles.ant} aria-label={'maximize'} onClick={(event) => onClickMaximize}>
                        <ArrowsAltOutlined />
                    </i>
                    <i className={styles.ant} aria-label={'minimize'} onClick={(event) => onClickMinimize}>
                        <ShrinkOutlined />
                    </i>
                </div>
            </div>
        )
    };

    return (
        <>
            <div id={styles.toolbar}>
                {Object.keys(VIEW_MAP).map((tool, i) => {
                    return (
                        <div className={styles.tool} aria-label={'tool-' + tool} style={{color: VIEW_MAP[tool]['color']}} onClick={() => onSelect(tool)}>
                            <FontAwesomeIcon icon={VIEW_MAP[tool]['icon']} size="lg" />
                        </div>
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
