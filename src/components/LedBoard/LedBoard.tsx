/* eslint-disable unicorn/prefer-spread */
import { useEffect, useState } from 'react';

import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { charMap } from './charMap';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function createMatrix(rows: number, cols: number) {
  // eslint-disable-next-line unicorn/no-new-array
  return new Array(rows).fill('').map(() => new Array(cols).fill(false));
}

interface Board {
  rows: number;
  cols: number;
  matrix: boolean[][];
}

function createBoard(word: string) {
  const rows = 15;
  const wordArray = word.trim().toUpperCase().split('');
  const cols =
    wordArray
      // +1 for extra padding
      .map((char) => (charMap[char] || charMap[' '])[0].length + 1)
      .reduce((a, b) => a + b, 1) * 2;

  const matrix = createMatrix(rows, cols);
  const startRow = 2;
  let startCol = 2;

  for (const charIndex in wordArray) {
    const char = wordArray[charIndex];
    const charPattern = charMap[char] || charMap[' '];

    for (const rowIndex in charPattern) {
      const row = charPattern[rowIndex];
      for (const colIndex in row) {
        const isLit = row[colIndex];
        if (isLit) {
          matrix[startRow + +rowIndex * 2][startCol + +colIndex * 2] = true;
        }
      }
    }

    // +1 for extra spacing
    startCol += (charPattern[0].length + 1) * 2;
  }

  return {
    rows,
    cols,
    matrix,
  };
}

export default function LedBoard({
  word = 'COPY',
}: {
  /**
   * The word to display on the LED board.
   * Currently only supports "C", "O","P", " and "Y". But you can add more in the `charMap` object.
   */
  word: string;
}) {
  const [{ rows, cols, matrix }, setBoard] = useState<Board>(createBoard(word));

  useEffect(() => setBoard(createBoard(word)), [word]);

  const [isHovering, setIsHovering] = useState(false);
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    if (isHovering) {
      return;
    }

    const interval = setInterval(() => {
      // Force a re-render so the random dots are animated
      setForceUpdate((current) => current + 1);
      // max animation duration is 3000ms (2000ms + 1000ms)
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <div
      className='group rounded-xl border border-gray-600 bg-gradient-to-bl from-zinc-950/80 via-zinc-900 via-30% to-zinc-950 to-75% p-4 dark:border-zinc-800'
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <svg className='h-auto w-full text-zinc-800' viewBox={`0 0 ${cols - 1} ${rows}`}>
        {matrix.map((row, rowIndex) =>
          row.map((isLit, colIndex) => {
            // Hide all odd rows and columns
            if (rowIndex % 2 === 1 || colIndex % 2 === 1) {
              return undefined;
            }

            const shouldAnimate = !isHovering && isLit && Math.random() > 0.8;
            let delay = 0;
            if (shouldAnimate) {
              delay = Math.floor(Math.random() * 1000);
            }

            return (
              <circle
                key={`${rowIndex}-${colIndex}`}
                cx={colIndex + 0.25}
                cy={rowIndex + 0.25}
                r={0.25}
                style={{
                  transitionDelay: isHovering ? '0ms' : `${colIndex * 15}ms`,
                  animationDuration: '2000ms',
                  animationDelay: `${delay}ms`,
                }}
                className={cn('fill-zinc-800 transition-all duration-200 ease-in-out', {
                  'group-hover:fill-[var(--led-color)]': isLit,
                  'animate-led ease-in-out': shouldAnimate,
                })}
              />
            );
          }),
        )}
      </svg>
    </div>
  );
}
