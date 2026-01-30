// Global audio utility for playing sounds across the app

class AudioPlayer {
    private audio: HTMLAudioElement | null = null;
    private volume: number = 0.6;

    constructor() {
        if (typeof window !== 'undefined') {
            this.audio = new Audio('/audio/level-complete-394515.mp3');
            this.audio.volume = this.volume;
            // Preload the audio
            this.audio.load();
        }
    }

    play() {
        if (this.audio) {
            // Reset to start and play
            this.audio.currentTime = 0;
            this.audio.play().catch(err => {
                console.log('Audio play failed:', err);
            });
        }
    }

    setVolume(vol: number) {
        this.volume = Math.max(0, Math.min(1, vol));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
    }
}

// Create singleton instance
export const audioPlayer = new AudioPlayer();

// Helper functions for specific events
export const playButtonClick = () => audioPlayer.play();
export const playWinSound = () => audioPlayer.play();
export const playLossSound = () => audioPlayer.play();
export const playSuccessSound = () => audioPlayer.play();
