'use client';
// 0
import React, { useState, useEffect, createRef, useRef } from 'react';
import Image from 'next/image';
import '../../styles/song-display.scss';
import Song from './Song';
import NavBar from '../nav-bar/NavBar';

import { scrollTo, getSongRef } from '../utils/ScrollTo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

export interface SongData {
  title: string;
  lyrics: string[];
  audioSrc?: string;
  reference?: React.RefObject<{ 
    stop: () => void; 
    getElement: () => HTMLDivElement | null 
  }>;
}

export default function SongDisplay(props: {}) {
  const [songs, setSongs] = useState<SongData[]>([]);
  const [songRefs, setSongRefs] = useState<React.RefObject<{ stop: () => void; getElement: () => HTMLDivElement | null }>[]>([]);
  const currentPlayingRef = useRef<React.RefObject<{ stop: () => void; getElement: () => HTMLDivElement | null }> | null>(null);

  const [songObjects, setSongObjects] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // Fetch the JSON data from the public folder
    fetch('/songs.json')
      .then((response) => response.json())
      .then((data: SongData[]) => {
        setSongs(data);

        const refs = data.map(() => createRef<{ stop: () => void; getElement: () => HTMLDivElement | null }>());
        setSongRefs(refs);

        const updatedSongs = data.map((song, index) => {
          song.reference = refs[index];
          return (
            <div key={index} className="song-container">
              <Song
                title={song.title}
                lyrics={song.lyrics}
                id={index + 1}
                audioSrc={song.audioSrc}
                ref={refs[index]}
                onPlay={() => {
                  if (currentPlayingRef.current && currentPlayingRef.current !== refs[index]) {
                    currentPlayingRef.current.current?.stop();
                  }
                  currentPlayingRef.current = refs[index];
                }}
                onLoaded={(title) => {
                  console.log(`${title} loaded`);
                }}
              />
          <div className="share-buttons">
            {typeof window !== 'undefined' && (
              <>
                <a href={`https://wa.me/?text=${encodeURIComponent(window.location.href + `?song=${encodeURIComponent(song.title)}`)}`} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faWhatsapp} size="2x" />
                </a>
                <a href={`https://twitter.com/share?url=${encodeURIComponent(window.location.href + `?song=${encodeURIComponent(song.title)}`)}`} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faTwitter} size="2x" />
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href + `?song=${encodeURIComponent(song.title)}`)}`} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFacebook} size="2x" />
                </a>
              </>
            )}
          </div>
            </div>
          );
        });
        setSongObjects(updatedSongs);
      })
      .catch((error) => {
        console.error('Error fetching songs:', error);
      });
  }, []);

  useEffect(() => {
    if (songRefs.length > 0 && typeof window !== 'undefined') {
      const query = new URLSearchParams(window.location.search).get('song');
      if (query) {
        const songRef = getSongRef(query, songRefs);
        if (songRef) {
          scrollTo(songRef);
        }
      }
    }
  }, [songRefs]);

  const searchForElement = (query: string) => {
    const reg = new RegExp(/^\d+$/);

    if (reg.test(query)) {
      let num = Number(query);
      num--;

      if (num < songs.length) {
        const song = songs[num];
        if (song.reference) {
          scrollTo(song.reference);
          return;
        }
      }
    } else {
      const queryLower = query.toLowerCase();
      for (const song of songs) {
        if (song.title.toLowerCase().includes(queryLower) && song.reference) {
          scrollTo(song.reference);
          return;
        }
      }
    }
  };

  return (
    <>
      <NavBar search={searchForElement} songs={songs} />
      <div className="All-songs custom-scrollbar" style={{ position: "relative" }}>
        <Image
          src="/carnet.jpeg"
          alt="Header"
          width={800} // Adjust width as needed
          height={0} // Adjust height as needed
          style={{ width: "70%", height: "auto", margin: "0 auto", paddingTop: "20px" }}
        />
        <span style={{ visibility: "collapse", position: "absolute" }}></span>
        {songObjects}
      </div>
    </>
  );
}
