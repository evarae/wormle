import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders game title', () => {
  render(<App />);
  const textElement = screen.getByText("WORMLE");
  expect(textElement).toBeInTheDocument();
});
