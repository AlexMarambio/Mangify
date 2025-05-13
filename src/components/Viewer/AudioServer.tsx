import { useEffect, useState } from 'react';

export function usePageAudio(volume: number,audioUrl?: string) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(true);

  const toggleAudio = () => {
    if (audio) {
      if (isPaused) {
        audio.play().catch(console.warn);
      } else {
        audio.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  useEffect(() => {
    if (audioUrl) {
      const newAudio = new Audio(audioUrl);
      newAudio.volume = volume;
      setAudio(newAudio);
      setIsPaused(true);

      const playAudio = () => {
        newAudio.play().catch(console.warn);
        setIsPaused(false);
        document.removeEventListener('click', playAudio);
      };

      document.addEventListener('click', playAudio);

      return () => {
        document.removeEventListener('click', playAudio);
        newAudio.pause();
      };
    } else {
      setAudio(null);
    }
  }, [audioUrl]);

  useEffect(() => {
    if (audio) {
      audio.volume = volume;
    }
  }, [volume, audio]);

  return {
    toggleAudio,
    isPaused,
  };
}
