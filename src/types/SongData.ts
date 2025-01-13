// types/SongData.ts
export interface Song {
  title: string;
  lyrics: string[];
  audioSrc?: string;
  reference?: React.RefObject<{ 
    stop: () => void; 
    getElement: () => HTMLDivElement | null 
  }>;
}
  
  export interface SongWithNumber extends Song {
    number: number;
  }
  