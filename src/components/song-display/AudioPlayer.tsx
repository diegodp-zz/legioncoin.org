import React, { useCallback, useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop, faPause, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Howl } from "howler";
import PropTypes from "prop-types";

interface AudioPlayerProps {
  audioSrc: string;
  onPlay: () => void;
  onLoaded: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc, onPlay, onLoaded }) => {
  const soundRef = useRef<Howl | null>(null);
  const [state, setState] = useState({
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    volume: 1,
    isLoading: false,
  });

  const loadSong = useCallback(() => {
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
        onLoaded();
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
  }, [audioSrc, state.volume, onLoaded]);

  useEffect(() => {
    loadSong();
    return () => {
      soundRef.current?.unload();
    };
  }, [loadSong]);

  const handlePlayPause = useCallback(() => {
    if (state.isLoading) return;

    if (!soundRef.current) {
      loadSong();
    } else {
      if (state.isPlaying) {
        soundRef.current.pause();
      } else {
        soundRef.current.play();
        onPlay();
      }
      setState((prevState) => ({ ...prevState, isPlaying: !prevState.isPlaying }));
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

  const handleSeekChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (state.isLoading) return;

    const newTime = parseFloat(event.target.value);
    setState((prevState) => ({ ...prevState, currentTime: newTime }));

    if (soundRef.current) {
      soundRef.current.seek(newTime);
    }
  }, [state.isLoading]);

  const { currentTime, duration, isPlaying, volume, isLoading } = state;

  return (
    <div className="controls">
      <button className="play-pause-button" onClick={handlePlayPause} disabled={isLoading} aria-label={isPlaying ? "Pause" : "Play"}>
        {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
      </button>
      <button className="stop-button" onClick={handleStop} aria-label="Stop"><FontAwesomeIcon icon={faStop} /></button>
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
  );
};

AudioPlayer.propTypes = {
  audioSrc: PropTypes.string.isRequired,
  onPlay: PropTypes.func.isRequired,
  onLoaded: PropTypes.func.isRequired,
};

export default AudioPlayer;
