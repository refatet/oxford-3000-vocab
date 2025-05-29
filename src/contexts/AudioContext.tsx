import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AudioContextType {
  play: (audioUrl: string) => Promise<void>;
  pause: () => void;
  stop: () => void;
  isPlaying: boolean;
  currentAudio: string | null;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup function
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [audio]);

  const play = async (audioUrl: string): Promise<void> => {
    if (audio) {
      // If we're already playing something, stop it
      audio.pause();
      audio.src = '';
    }

    try {
      const newAudio = new Audio(audioUrl);
      
      // Set up event listeners
      newAudio.addEventListener('play', () => setIsPlaying(true));
      newAudio.addEventListener('pause', () => setIsPlaying(false));
      newAudio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentAudio(null);
      });
      
      setAudio(newAudio);
      setCurrentAudio(audioUrl);
      
      // Play the audio
      await newAudio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  };

  const pause = (): void => {
    if (audio && !audio.paused) {
      audio.pause();
    }
  };

  const stop = (): void => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setCurrentAudio(null);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        play,
        pause,
        stop,
        isPlaying,
        currentAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  
  return context;
};
