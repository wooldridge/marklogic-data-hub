import React, { CSSProperties } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './toolbar.module.scss';
import './toolbar.scss';
import { MLTooltip } from '@marklogic/design-system';


interface Props {
    tiles: any;
    enabled: any;
}

const Toolbar: React.FC<Props> = (props) => {

    const history = useHistory();

    const tiles = props.tiles; // config/tiles.config.ts

    // array of references used to set focus
    let tileRefs = new Array();
    for (var i = 0; i < Object.keys(tiles).length; ++i ) tileRefs.push(React.createRef<HTMLDivElement>());    

    const getTooltip = (id) => {
        if (props.enabled && props.enabled.includes(id)) {
            return tiles[id]['title'];
        } else {
            return `${tiles[id]['title']}: Contact your security administrator to get the roles and permissions required to access this functionality.`;
        }
    };

    const getIconStyle = (id) => {
        let disabled: CSSProperties = {
            color: 'grey',
            opacity: '0.5',
            cursor: 'not-allowed'
        };
        let enabled: CSSProperties = {
            color: tiles[id]['color']
        };
        return (props.enabled && props.enabled.includes(id)) ? enabled : disabled;
    };

    const tileKeyDownHandler = (event, id, index) => {
        if(event.key == 'Enter' && props.enabled && props.enabled.includes(id)) history.push(`/tiles/${id}`)
        if(event.key == 'ArrowUp' && index > 0) tileRefs[index-1].current.focus()
        if(event.key == 'ArrowDown' && index < (Object.keys(tiles).length - 1)) tileRefs[index+1].current.focus()
    };

    const tileOnClickHandler = (id) => {
        if (props.enabled && props.enabled.includes(id)) history.push(`/tiles/${id}`)
    };

    const tileOnFocusHandler = (id, index) => {
        //tileRefs[index].current.style.color = 'rgb(255, 0, 0)';
        //tileRefs[index].current.style.border = "1px solid red";
    };

    const tileOnBlurHandler = (id, index) => {
        //tileRefs[index].current.style.color = tiles[id]['color'];
        //tileRefs[index].current.style.border = null;
    }

    return (
        <div id={styles.toolbar} aria-label={'toolbar'}>
            {Object.keys(tiles).map((id, i) => {
                if (tiles[id]['iconType'] === 'custom') {
                    return (
                        <div aria-label={'tool-' + id + '-link'} key={i} tabIndex={-1}>
                            <MLTooltip title={getTooltip(id)} placement="leftTop" key={i}>
                                <div
                                    className={tiles[id]['icon']}
                                    aria-label={'tool-' + id}
                                    style={getIconStyle(id)}
                                    onFocus={(e) => tileOnFocusHandler(id, i)}
                                    onBlur={(e) => tileOnBlurHandler(id, i)}
                                    tabIndex={1}
                                    ref={tileRefs[i]}
                                    onClick={(e) => tileOnClickHandler(id)}
                                    onKeyDown={(e) => tileKeyDownHandler(e, id, i)}
                                />
                            </MLTooltip>
                        </div>
                    );
                } else {
                    return (
                        <MLTooltip title={getTooltip(id)} placement="leftTop" key={i}>
                            <div aria-label={'tool-' + id + '-link'} tabIndex={-1}>
                                <i
                                    className={styles.tool}
                                    aria-label={'tool-' + id}
                                    style={getIconStyle(id)}
                                    tabIndex={1}
                                    ref={tileRefs[i]}
                                    onClick={(e) => tileOnClickHandler(id)}
                                    onKeyDown={(e) => tileKeyDownHandler(e, id, i)}
                                >
                                    <FontAwesomeIcon icon={tiles[id]['icon']} size="lg" />
                                </i>
                            </div>
                        </MLTooltip>
                    );
                }
            })}
        </div>
    );
};

export default Toolbar;
