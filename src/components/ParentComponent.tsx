import React, { useRef, useState } from 'react';
import TableOfContents from './nav-bar/TableOfContents';
import Song from './song-display/Song';
import { Song as SongType } from '../types/SongData';
import JSONSongs from '../../public/songs.json';

const songsData: SongType[] = JSONSongs;

const ParentComponent: React.FC = () => {
  const [isTOCVisible, setIsTOCVisible] = useState<boolean>(true);
  const songRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([]);

  if (songRefs.current.length !== songsData.length) {
    // Initialize the refs array to have a ref for each song
    songRefs.current = Array(songsData.length)
      .fill(null)
      .map((_, i) => songRefs.current[i] || React.createRef<HTMLDivElement>());
  }

  const handlePlay = () => {
    // Any custom logic when a song starts playing can be added here
  };

  const handleLoaded = (title: string) => {
    // Any custom logic when a song is loaded can be added here
  };

  const toggleTOCVisibility = () => {
    setIsTOCVisible(!isTOCVisible);
  };

  return (
    <div className="parent-component">
      <button onClick={toggleTOCVisibility}>
        {isTOCVisible ? 'Hide' : 'Show'} Table of Contents
      </button>
      <TableOfContents
        songs={songsData}
        setVisibility={setIsTOCVisible}
        isVisible={isTOCVisible}
      />
      <div className="all-songs">
        {songsData.map((song, index) => (
          <div key={song.title} ref={songRefs.current[index]}>
            <Song
              title={song.title}
              lyrics={song.lyrics}
              audioSrc={song.audioSrc}
              id={index}
              onPlay={handlePlay}
              onLoaded={handleLoaded}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentComponent;
