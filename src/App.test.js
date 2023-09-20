import { render, screen } from '@testing-library/react';
import App from './App';

test('renders application', () => {
  render(<App />);
  const linkElement = screen.getByText(/music4me/i);
  expect(linkElement).toBeInTheDocument();
});
