import React from 'react';
import { render, fireEvent, waitForElement, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Multipane from '../pages/Multipane';
import { shallow } from 'enzyme';

describe('Multipane component', () => {

    it('initially renders with the toolbar and no tile', () => {
        const {getAllByText, getByText, getByLabelText, debug} = render(<Multipane/>);
        expect(getByLabelText("toolbar")).toBeInTheDocument();
        expect(getByLabelText("tool-load")).toBeInTheDocument();
        expect(getByLabelText("tool-model")).toBeInTheDocument();
        expect(getByLabelText("tool-curate")).toBeInTheDocument();
        expect(getByLabelText("tool-run")).toBeInTheDocument();
        expect(getByLabelText("tool-explore")).toBeInTheDocument();
    });

    it('shows the Curate tile when toolbar button is clicked', () => {
        const {getAllByText, getByText, getByLabelText, debug} = render(<Multipane/>);
        // Click disclosure icon
        fireEvent.click(getByLabelText("tool-curate"));
        debug();
    });

});
