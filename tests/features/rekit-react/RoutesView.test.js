import React from 'react';
import { shallow } from 'enzyme';
import { RoutesView } from '../../../src/features/rekit-react';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<RoutesView />);
  expect(renderedComponent.find('.rekit-react-routes-view').length).toBe(1);
});
