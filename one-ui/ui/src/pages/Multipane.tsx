import React from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import styles from './Multipane.module.scss';
import '../../node_modules/react-mosaic-component/react-mosaic-component.css';
import '../../node_modules/@blueprintjs/core/lib/css/blueprint.css';
import '../../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css';

import Bench from './Bench';
import EntityTypes from './EntityTypes';
import LoadData from './LoadData';

export type ViewId = 'Bench' | 'EntityTypes' | 'LoadData' | 'new';

const TITLE_MAP: Record<ViewId, string> = {
    Bench: 'Tool Bench',
    EntityTypes: 'Entities',
    LoadData: 'Load Data',
    new: 'New Window',
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

const Multipane = (props) => {

   return (
    <div id="multipane" className={styles.multipaneContainer}>
        <Mosaic<ViewId>
            renderTile={(id, path) => (
            <MosaicWindow<ViewId> 
                path={path} 
                createNode={() => 'new'} 
                title={TITLE_MAP[id]}
            >
                <h1>{ELEMENT_MAP[id]}</h1>
            </MosaicWindow>
            )}
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
