import React from 'react';
import { render, fireEvent, waitForElement, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import TilesView from './TilesView';
import { shallow } from 'enzyme';

describe('TilesView component', () => {

    it('renders with the toolbar and displays tile after button click', () => {
        const {getByLabelText, queryByText} = render(<TilesView/>);

        expect(getByLabelText("toolbar")).toBeInTheDocument();

        expect(getByLabelText("tool-load")).toBeInTheDocument();
        expect(getByLabelText("tool-model")).toBeInTheDocument();
        expect(getByLabelText("tool-curate")).toBeInTheDocument();
        expect(getByLabelText("tool-run")).toBeInTheDocument();
        expect(getByLabelText("tool-explore")).toBeInTheDocument();

        // Tile not shown initially
        expect(queryByText("icon-curate")).not.toBeInTheDocument();
        expect(queryByText("title-curate")).not.toBeInTheDocument();

        fireEvent.click(getByLabelText("tool-curate"));
        
        // Tile shown after click
        expect(getByLabelText("icon-curate")).toBeInTheDocument();
        expect(getByLabelText("title-curate")).toBeInTheDocument();
    });

});