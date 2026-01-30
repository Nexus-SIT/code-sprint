import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 30) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayedText('');
        setIsComplete(false);

        if (!text) return;

        let index = 0;
        const intervalId = setInterval(() => {
            index++;
            setDisplayedText(text.slice(0, index));
            if (index >= text.length) {
                clearInterval(intervalId);
                setIsComplete(true);
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed]);

    return { displayedText, isComplete };
};
