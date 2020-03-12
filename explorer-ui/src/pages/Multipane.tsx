import React, { useContext, useState, useEffect } from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import styles from './Multipane.module.scss';
import 'react-mosaic-component/react-mosaic-component.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { Icon } from 'antd';

import {
    SplitCellsOutlined,
} from '@ant-design/icons';

import Bench from './Bench';
import EntityTypes from './EntityTypes';
import LoadData from './LoadData';

//import { MosaicWindowContext, MosaicContext } from 'react-mosaic-component/src';

export type ViewId = 'Bench' | 'EntityTypes' | 'LoadData' | 'new';

const TITLE_MAP: Record<ViewId, string> = {
    Bench: 'Bench',
    EntityTypes: 'EntityTypes',
    LoadData: 'LoadData',
    new: 'new',
};

const ELEMENT_MAP: { [viewId: string]: JSX.Element } = {
    Bench: <Bench/>,
    EntityTypes: <EntityTypes/>,
    LoadData: <LoadData/>,
    new: <div>New Window</div>
};

const onChange = () => {
    console.log('Multipane changed!');
}

const onRelease = () => {
    console.log('Multipane released!');
}

const onClickMenu = (event) => {
    console.log('Menu clicked!', event);
}

const onClickSplit = (event) => {
    console.log('Split clicked!', event);
}

const onClickClose = (event) => {
    console.log('Close clicked!', event);
}

const Multipane: React.FC  = (props) => {
    //const { mosaicId } = useContext(MosaicContext);
    const [selected, setSelected] = useState('');

    const onClickToolbar = (event) => {
        console.log('Toolbar clicked!', selected, event.target.id);
        setSelected(event.target.id);
    }

    const toolbar = function (props, draggable) {
        console.log(props, draggable);
        return (
        <div id={props.title} className={styles.toolbar} onClick={onClickToolbar}>
            <div className={styles.toolbarIcon} onClick={(event) => onClickMenu}>
                <Icon type="menu" />
            </div>
            <div className={styles.toolbarIcon} onClick={onClickSplit}>
                <SplitCellsOutlined />
            </div>
            <div className={styles.toolbarIcon} onClick={onClickClose}>
                <Icon type="close-circle" />
            </div>
        </div>
    )};

    return (
        <div id="multipane" className={styles.multipaneContainer}>
            <Mosaic<ViewId>
                renderTile={(id, path) => { 
                    console.log('renderTile', id, path);
                    return (
                    <MosaicWindow<ViewId> 
                        className={selected === id ? 'selected' : ''}
                        path={path} 
                        createNode={() => 'new'} 
                        title={TITLE_MAP[id]}
                        // UNCOMMENT THE BELOW TO SHOW CUSTOM TOOL ICONS
                        renderToolbar={toolbar}
                    >
                        <h1>{ELEMENT_MAP[id]}</h1>
                    </MosaicWindow>
                    )
                }}
                initialValue={{
                    direction: 'column',
                    first: {
                        direction: 'row',
                        first: 'LoadData',
                        second: 'EntityTypes',
                    },
                    second: 'Bench',
                }}
                onChange={onChange}
                onRelease={onRelease}
            />
        </div>
    );
}

export default Multipane;
