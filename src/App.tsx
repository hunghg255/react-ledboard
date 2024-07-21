import { useState } from 'react';

import { GithubCorners } from 'react-gh-corners';

import LedBoard from '@/components/LedBoard/LedBoard';

function App() {
  const [value, setValue] = useState('Hello');

  return (
    <>
      <main>
        <LedBoard word={value} />
      </main>
      <br />
      <br />

      <div>
        <h1 className='text-white'>Text</h1>
        <input value={value} type='text' onChange={(e) => setValue(e.target.value)} />
      </div>
      <br />
      <div>
        <h1 className='text-white'>Color</h1>
        <input
          type='color'
          onChange={(e) => {
            document.documentElement.style.setProperty('--led-color', e.target.value);
          }}
        />
      </div>

      <GithubCorners position='right' href='https://github.com/hunghg255/react-ledboard' />
    </>
  );
}

export default App;
