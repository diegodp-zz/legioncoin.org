import React, { useState, useEffect } from "react";

interface HighlightedLyricsProps {
  lyrics: string[];
  currentTime: number;
  onLyricClick: (timestamp: string) => void;
}

const HighlightedLyrics: React.FC<HighlightedLyricsProps> = ({ lyrics, currentTime, onLyricClick }) => {
  const [highlightedLineIndex, setHighlightedLineIndex] = useState<number | null>(null);

  useEffect(() => {
    const updateHighlightedLine = () => {
      let currentIndex: number | null = null;

      lyrics.forEach((lyric, index) => {
        const timestampRegex = /\[(\d+:\d+)\]/g;
        let match;
        let timestamps: number[] = [];

        while ((match = timestampRegex.exec(lyric)) !== null) {
          const timestamp = match[1];
          const [minutes, seconds] = timestamp.split(":").map(Number);
          const targetTime = minutes * 60 + seconds;
          timestamps.push(targetTime);
        }

        if (timestamps.some(time => currentTime >= time)) {
          currentIndex = index;
        }
      });

      setHighlightedLineIndex(currentIndex);
    };

    updateHighlightedLine();
  }, [currentTime, lyrics]);

  return (
    <div style={{ lineHeight: "1.5", marginBottom: "10px", textAlign: "center" }}>
      {lyrics.map((lyric, index) => (
        <p
          key={index}
          style={{ margin: "0", cursor: "pointer" }}
          onClick={() => {
            const match = lyric.match(/\[(\d+:\d+)\]/);
            if (match) onLyricClick(match[1]);
          }}
        >
          {renderLyric(lyric, index, highlightedLineIndex)}
        </p>
      ))}
    </div>
  );
};

const renderLyric = (lyric: string, index: number, highlightedLineIndex: number | null) => {
  const timestampRegex = /\[(\d+:\d+)\]/g;
  const lyricWithoutTimestamp = lyric.replace(timestampRegex, '').trim();
  const isBold = lyricWithoutTimestamp.startsWith("<b>") && lyricWithoutTimestamp.endsWith("</b>");

  return isBold ? (
    <strong key={index}>
      <span
        style={{
          backgroundColor: index === highlightedLineIndex ? "rgba(198, 255, 198, 0.3" : "transparent",
          padding: "2px 5px",
          marginRight: "3px",
          borderRadius: "5px"
        }}
      >
        {lyricWithoutTimestamp.substring(3, lyricWithoutTimestamp.length - 4)}
      </span>
    </strong>
  ) : (
    <span
      key={index}
      style={{
        backgroundColor: index === highlightedLineIndex ? "rgba(198, 255, 198, 0.3)" : "transparent",
        padding: "2px 5px",
        marginRight: "3px",
        borderRadius: "5px"
      }}
    >
      {lyricWithoutTimestamp}
    </span>
  );
};

export default HighlightedLyrics;
