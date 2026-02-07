import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import App from './app';

describe('<App />', () => {
  it('loads and display greetings', async () => {
    const screen = await render(<App />);

    const heading = screen.getByRole('heading');

    expect(heading).toHaveTextContent(/welcome!/i);
  });
});
