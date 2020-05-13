import React, { useState } from 'react';
import tiles from '../config/tiles.config'
import Toolbar from '../components/tiles/Toolbar';
import Tiles from '../components/tiles/Tiles';
import styles from './TilesView.module.scss';
import './TilesView.scss';

import LoadData from './LoadData';
import Modeling from './Modeling';
import EntityTypes from './EntityTypes';
import Bench from './Bench';
import Browse from './Browse';

export type TileId =  'load' | 'model' | 'curate' | 'run' | 'explore';
export type IconType = 'fa' | 'custom';
interface TileItem {
    title: string;
    iconType: IconType;
    icon: any;
    color: string;
    bgColor: string;
    border: string;
}

const views: Record<TileId, JSX.Element>  = {
    load: <LoadData/>,
    model: <Modeling/>,
    curate: <EntityTypes/>,
    run: <Bench/>,
    explore: <Browse/>,
};

const INITIAL_SELECTION = ''; // '' for no tile initially

const TilesView: React.FC  = (props) => {
    const [selection, setSelection] = useState<TileId|string>(INITIAL_SELECTION);
    const [currentNode, setCurrentNode] = useState<any>(INITIAL_SELECTION);
    const [options, setOptions] = useState<TileItem|null>(null);

    // let elements = {};
    // Object.keys(tiles).forEach(id => {
    //     elements[id] = React.createElement(tiles[id]['element'], {});
    // })

    const onSelect = (tool) => {
        setSelection(tool);
        update(tool);
    }

    const update = (viewId) => {
        const updatedNode = viewId;
        setOptions(tiles[viewId]);
        setCurrentNode(updatedNode);
    }

    return (
        <>
            <Toolbar tiles={tiles} onClick={onSelect} />
            <div className={styles.tilesViewContainer}>
                { (selection !== '') ?  (
                <Tiles 
                    id={selection}
                    view={views[selection]}
                    currentNode={currentNode}
                    controls={[]} // TODO Turn on controls
                    options={options}
                />) : null }
            </div>
        </>
    );
}

export default TilesView;
