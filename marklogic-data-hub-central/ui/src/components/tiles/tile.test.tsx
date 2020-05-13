import React from 'react';
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Tiles from './Tiles';
import { faCube } from "@fortawesome/free-solid-svg-icons";
import TestComponent from '../../config/test-component'

describe('Tiles component', () => {
    it('renders with a FontAwesome icon', () => {
        const color = '#000';
        const text = 'test';
        const options = {
            title: text, 
            iconType: 'fa', 
            icon: faCube, 
            color: color, 
            bgColor: color, 
            border: color
        };
        const {getByLabelText, debug} = render(
            <Tiles 
                id={text}
                view={<TestComponent/>}
                currentNode={text}
                controls={[]}
                options={options}
            />
        );
        debug();
        expect(getByLabelText('icon-' + text)).toBeInTheDocument();
        expect(getByLabelText('title-' + text)).toBeInTheDocument();
    });
    it('renders with a custom icon', () => {
        const color = '#000';
        const text = 'test';
        const options = {
            title: text, 
            iconType: 'custom', 
            icon: 'exploreIcon', 
            color: color, 
            bgColor: color, 
            border: color
        };
        const {getByLabelText, debug} = render(
            <Tiles 
                id={text}
                view={<TestComponent/>}
                currentNode={text}
                controls={[]}
                options={options}
            />
        );
        debug();
        expect(getByLabelText('icon-' + text)).toBeInTheDocument();
        expect(getByLabelText('title-' + text)).toBeInTheDocument();
    });
});
