'use client';
//0
import React, { useEffect, useState } from 'react';
import { scrollTo } from '../utils/ScrollTo';
import SearchBar from './SearchBar';

import { Song, SongWithNumber } from '../../types/SongData';

interface TableOfContentsProps {
  songs: Song[];
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  isVisible: boolean;
}

const cleanse = (search: string) => {
  return search.toLowerCase().replaceAll(/[^\w\d\s]/g, '');
};

const matches = (search: string, song: SongWithNumber) => {
  let title = cleanse(song.title);
  return title.includes(search) || song.number + 1 === Number.parseInt(search);
};

const search = (search: string, songs: Song[]) => {
  let output = songs.slice().map((value, index) => ({
    ...value,
    number: index,
  }));

  search = cleanse(search);

  for (let i = 0; i < output.length; i++) {
    if (!matches(search, output[i])) {
      output.splice(i, 1);
      i--;
    }
  }

  return output;
};

const formatSongs = (
  songs: { title: string; number: number }[],
  onItemPress: (item: { title: string }, index: number) => void
) => {
  let formatted = songs.map((song) => ({
    name: song.title,
    dom: (
      <p onClick={() => onItemPress({ title: song.title }, song.number)} key={song.title + song.number}>
        {song.title}
      </p>
    ),
  }));

  formatted.sort((a, b) => (a.name > b.name ? 1 : -1));

  let startingChar = ' ';
  for (let i = 0; i < formatted.length; i++) {
    if (startingChar.toLowerCase() !== formatted[i].name[0].toLowerCase()) {
      startingChar = formatted[i].name[0].toLowerCase();
      formatted.splice(i, 0, {
        name: startingChar,
        dom: (
          <h1 key={startingChar}><span>{startingChar.toUpperCase()}</span></h1>
        ),
      });
    }
  }

  let output = formatted.map((song) => song.dom);

  return output;
};

const TableOfContents: React.FC<TableOfContentsProps> = ({ songs, setVisibility, isVisible }) => {
  const [output, setOutput] = useState<JSX.Element[]>([]);
  const [songResults, setSongResults] = useState<SongWithNumber[]>(
    songs.map((value, index) => ({ ...value, number: index }))
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onItemPress = (_item: { title: string }, index: number) => {
    setVisibility(false);
    scrollTo(songs[index].reference);
  };

  const updateSearch = (query: string) => {
    setSongResults(search(query, songs));
  };

  useEffect(() => {
    const songsList = songResults.map((value) => ({ title: value.title, number: value.number }));
    setOutput(formatSongs(songsList, onItemPress));
  }, [songs, songResults, onItemPress]);

  return (
    <div className="Table-of-contents custom-scrollbar" style={{
      visibility: isVisible ? 'visible' : 'collapse',
    }} onClick={() => setVisibility(false)} >
      <div className="content" onClick={(e) => e.stopPropagation()}>
        <SearchBar search={updateSearch} />
        <div>
          {output}
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
