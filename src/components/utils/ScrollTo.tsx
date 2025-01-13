import { Song } from '../../types/SongData';
import JSONSongs from '../../../public/songs.json';

let songs: Song[] = JSONSongs;

export const getSongRef = (title: string, refs: React.RefObject<any>[]) => {
  const index = songs.findIndex(song => song.title === title);
  if (index === -1 || !refs[index]) {
    console.error(`Song or ref not found for title: ${title}`);
    return null;
  }
  return refs[index] as React.RefObject<{ stop: () => void, getElement: () => HTMLDivElement | null }>;
};

export const scrollTo = (ref?: React.RefObject<any>) => {
  if (typeof window !== 'undefined' && ref?.current) {
    const element = (ref.current as { getElement: () => HTMLDivElement | null }).getElement();
    if (!element) {
      console.error("ref.current.getElement() is null or undefined");
      return;
    }

    const relative = document.getElementsByClassName("All-songs")[0].children[0] as HTMLDivElement;
    const offset = 0;
    const bodyRect = relative.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPos = elementRect - bodyRect;
    const offsetPos = elementPos - offset;

    document.getElementsByClassName("All-songs")[0]?.scrollTo({
      top: offsetPos,
      behavior: "smooth"
    });
  }
};
