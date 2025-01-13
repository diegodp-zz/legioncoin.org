'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import '../../styles/nav-bar.scss';
import TableOfContents from './TableOfContents';
import { SongData } from '../song-display/SongDisplay';

interface NavBarProps {
  search: (query: string) => void;
  songs: SongData[];
}

const NavBar: React.FC<NavBarProps> = ({ search, songs }) => {
  const [isVisible, setVisibility] = useState(false);

  const toggleVisibility = () => {
    setVisibility(!isVisible);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className={`Nav-bar ${isVisible ? 'expanded' : ''}`}>
      <div className="Expand-icon" onClick={toggleVisibility}>
        <div className={isVisible ? 'open' : ''} />
      </div>
      <span onClick={reloadPage} style={{ cursor: 'pointer' }}>Chants de la Légion étrangère</span>
      {isVisible && (
        <TableOfContents songs={songs} setVisibility={setVisibility} isVisible={isVisible} />
      )}
      
    </div>
  );
};

export default NavBar;
