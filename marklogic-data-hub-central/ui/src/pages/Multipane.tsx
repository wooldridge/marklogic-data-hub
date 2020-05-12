import React, { useState } from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import { Tooltip } from 'antd';
import 'react-mosaic-component/react-mosaic-component.css';
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import tiles from '../config/tiles.config'
import Toolbar from '../components/tiles/Toolbar';
import styles from './Multipane.module.scss';
import './Multipane.scss';

import LoadData from './LoadData';
import Modeling from './Modeling';
import EntityTypes from './EntityTypes';
import Bench from './Bench';
import Browse from './Browse';

export type TileId =  'load' | 'model' | 'curate' | 'run' | 'explore';
export type Control = 'newTab' | 'maximize' | 'minimize';

const views: Record<TileId, JSX.Element>  = {
    load: <LoadData/>,
    model: <Modeling/>,
    curate: <EntityTypes/>,
    run: <Bench/>,
    explore: <Browse/>,
};

const CONTROLS: Control[]  = []; // TODO Turn on controls: ['newTab', 'maximize', 'minimize']
const INITIAL_SELECTION = ''; // '' for no tile initially

const Multipane: React.FC  = (props) => {
    const [selection, setSelection] = useState<any>(INITIAL_SELECTION);
    const [currentNode, setCurrentNode] = useState<any>(INITIAL_SELECTION);

    let elements = {};
    Object.keys(tiles).forEach(id => {
        elements[id] = React.createElement(tiles[id]['element'], {});
    })

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
        Object.keys(tiles).forEach(id => {
            if (tiles[id]['title'] === props.title) {
                viewId = id;
            }
        });
        return (
            <div 
                className={styles.paneHeader} 
                style={{backgroundColor: tiles[viewId]['bgColor'], borderBottomColor: tiles[viewId]['border']}}
            >
                <div className={styles.title}>
                    Explore 
                    { (viewId === 'explore') ? (
                        <>
                            <span className={'exploreIconHeader'} aria-label={'icon-' + viewId} style={{color: tiles[viewId]['color']}}></span>
                            <label className={styles.exploreText}>{props.title}</label>
                        </>
                    ) : (
                        <>
                            <i aria-label={'icon-' + viewId}>
                                <FontAwesomeIcon style={{color: tiles[viewId]['color']}} icon={tiles[viewId]['icon']} />
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
            <Toolbar tiles={tiles} onClick={onSelect} />

            { (selection !== '') ?  (
            <div id="multipane" className={styles.multipaneContainer}>
                <Mosaic<TileId>
                    renderTile={(id, path) => { 
                        return (
                            <MosaicWindow<TileId> 
                                path={path} 
                                title={tiles[id]['title']}
                                renderToolbar={renderHeader}
                            >
                                {views[id]}
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
