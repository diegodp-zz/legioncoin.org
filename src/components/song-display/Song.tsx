import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faPause, faSpinner } from '@fortawesome/free-solid-svg-icons';
import HighlightedLyrics from './HighlightedLyrics';
import { Howl } from 'howler';
import PropTypes from 'prop-types';
import '../../styles/song-display.scss';

interface SongProps {
  title: string;
  lyrics: string[];
  audioSrc?: string;
  id?: number;
  onPlay: () => void;
  onLoaded: (title: string) => void;
}

interface SongHandle {
  stop: () => void;
  getElement: () => HTMLDivElement | null;
}

const Song: React.ForwardRefRenderFunction<SongHandle, SongProps> = (
  { title, lyrics, audioSrc, id, onPlay, onLoaded },
  ref
) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<Howl | null>(null);
  const [state, setState] = useState({
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    volume: 1,
    isLoading: false,
  });

  useImperativeHandle(ref, () => ({
    stop: handleStop,
    getElement: () => internalRef.current,
  }));

  const loadSong = useCallback(() => {
    if (audioSrc) {
      setState((prevState) => ({ ...prevState, isLoading: true }));
      soundRef.current = new Howl({
        src: [audioSrc],
        preload: true,
        html5: true,
        volume: state.volume,
        onload: () => {
          setState((prevState) => ({
            ...prevState,
            duration: soundRef.current?.duration() || 0,
            isLoading: false,
          }));
          onLoaded(title);
          handlePlayPause();
        },
        onplay: () => {
          const updateCurrentTime = () => {
            if (soundRef.current) {
              setState((prevState) => ({
                ...prevState,
                currentTime: soundRef.current?.seek() as number,
              }));
              requestAnimationFrame(updateCurrentTime);
            }
          };
          updateCurrentTime();
        },
        onloaderror: (id, error) => {
          console.error(`Failed to load audio: ${error}`);
          setState((prevState) => ({ ...prevState, isLoading: false }));
        },
        onplayerror: (id, error) => {
          console.error(`Failed to play audio: ${error}`);
          setState((prevState) => ({ ...prevState, isLoading: false }));
        },
      });
      soundRef.current.load();
    }
  }, [audioSrc, state.volume, onLoaded, title]);

  useEffect(() => {
    return () => {
      soundRef.current?.unload();
    };
  }, []);

  const handleLyricClick = useCallback(
    (timestamp: string) => {
      if (state.isLoading) return;

      const [minutesStr, secondsStr] = timestamp.split(':');
      const minutes = parseInt(minutesStr, 10);
      const seconds = parseInt(secondsStr, 10);

      if (!isNaN(minutes) && !isNaN(seconds) && soundRef.current) {
        const targetTime = minutes * 60 + seconds;
        soundRef.current.stop(); 
        soundRef.current.seek(targetTime);
        soundRef.current.play();
        onPlay();
        setState((prevState) => ({ ...prevState, isPlaying: true }));
      } else {
        console.error('Invalid timestamp format:', timestamp);
      }
    },
    [state.isLoading, onPlay]
  );

const handlePlayPause = useCallback(() => {
  if (state.isLoading) return;

  if (!soundRef.current) {
    loadSong();
  } else {
    if (soundRef.current.playing()) {
      soundRef.current.pause();
      setState((prevState) => ({ ...prevState, isPlaying: false }));
    } else {
      soundRef.current.play();
      setState((prevState) => ({ ...prevState, isPlaying: true }));
      onPlay();
    }
  }
}, [state.isLoading, state.isPlaying, loadSong, onPlay]);

  const handleStop = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
      setState((prevState) => ({
        ...prevState,
        isPlaying: false,
        currentTime: 0,
      }));
    }
  }, []);

  const handleVolumeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setState((prevState) => ({ ...prevState, volume: newVolume }));
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  }, []);

  const handleSeekChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (state.isLoading) return;

      const newTime = parseFloat(event.target.value);
      setState((prevState) => ({ ...prevState, currentTime: newTime }));

      if (soundRef.current) {
        soundRef.current.seek(newTime);
      }
    },
    [state.isLoading]
  );

  const { currentTime, duration, isPlaying, volume, isLoading } = state;

  return (
    <div className="song" ref={internalRef}>
      <h1 className="song-title">{title}</h1>
      {id && <div style={{ display: 'none' }}>{id}</div>}
      <HighlightedLyrics
        lyrics={lyrics}
        currentTime={currentTime}
        onLyricClick={handleLyricClick}
      />
      {audioSrc && (
        <div className="controls">
          <button
            className="play-pause-button"
            onClick={handlePlayPause}
            disabled={isLoading}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : isPlaying ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
          </button>
          <button className="stop-button" onClick={handleStop} aria-label="Stop">
            <FontAwesomeIcon icon={faStop} />
          </button>
          <div className="seek-bar">
            <label>Seek:</label>
            <input
              type="range"
              min="0"
              max={duration}
              step="0.01"
              value={currentTime}
              onChange={handleSeekChange}
              disabled={isLoading}
            />
            {isLoading && <div className="loading-spinner">Loading...</div>}
          </div>
          <div className="volume-control">
            <label>Volume:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              disabled={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

Song.propTypes = {
  title: PropTypes.string.isRequired,
  lyrics: PropTypes.arrayOf(PropTypes.string).isRequired,
  audioSrc: PropTypes.string,
  id: PropTypes.number,
  onPlay: PropTypes.func.isRequired,
  onLoaded: PropTypes.func.isRequired,
} as any; // Cast to any to bypass TypeScript type checking for propTypes

export default forwardRef(Song);
