import React from 'react';
import { render, fireEvent, waitForElement, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import TilesView from './TilesView';

describe('TilesView component', () => {

    it('initially renders with the toolbar and no tile', () => {
        const {getByLabelText} = render(<TilesView/>);
        expect(getByLabelText("toolbar")).toBeInTheDocument();
        expect(getByLabelText("tool-load")).toBeInTheDocument();
        expect(getByLabelText("tool-model")).toBeInTheDocument();
        expect(getByLabelText("tool-curate")).toBeInTheDocument();
        expect(getByLabelText("tool-run")).toBeInTheDocument();
        expect(getByLabelText("tool-explore")).toBeInTheDocument();
    });

    it('shows the Curate tile when toolbar button is clicked', () => {
        const {getByLabelText, debug} = render(<TilesView/>);
        // Click disclosure icon
        fireEvent.click(getByLabelText("tool-curate"));
        // Mock the onSelect()
        debug();
    });

});
