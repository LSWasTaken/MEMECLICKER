import { useEffect, useState } from 'react';
import './App.css';

const ranks = [
  '🍼 Baby Clicker',
  '🧠 Reddit Scholar',
  '👑 Meme Knight',
  '💀 Giga Clicker',
  '🪑 Chair Whisperer',
  '🌌 Lord of the Memes',
  '🧙‍♂️ Dank Wizard',
  '🌍 World Click Champion',
  '👾 Reality Bender',
  '💫 Click God',
];

const emojiList = ['🔥', '💯', '😂', '🥵', '🐸', '🧠', '💀', '🪑', '🍕', '🧃'];

function App() {
  const [count, setCount] = useState(0);
  const [emojis, setEmojis] = useState([]);

  const currentRank = Math.floor(count / 1000);
  const rankName = ranks[currentRank] || '👽 Interdimensional Clicker';
  const progress = ((count % 1000) / 1000) * 100;

  const handleClick = () => setCount((c) => c + 1);

  const handleEmojiClick = (id: number) => {
    setCount((c) => c + 1000);
    setEmojis((prev) => prev.filter((e) => e.id !== id));
  };

  useEffect(() => {
    const spawnEmoji = () => {
      const id = Date.now();
      const newEmoji = {
        id,
        emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
        left: Math.random() * 90,
        top: Math.random() * 80,
      };
      setEmojis((prev) => [...prev, newEmoji]);

      // Auto-remove after 3s
      setTimeout(() => {
        setEmojis((prev) => prev.filter((e) => e.id !== id));
      }, 3000);
    };

    const spawnInterval = setInterval(spawnEmoji, 1500);
    return () => clearInterval(spawnInterval);
  }, []);

  // Move emojis randomly
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setEmojis((prev) =>
        prev.map((e) => ({
          ...e,
          left: Math.random() * 90,
          top: Math.random() * 80,
        }))
      );
    }, 250); // they move every 250ms
    return () => clearInterval(moveInterval);
  }, []);

  return (
    <div className="meme-zone">
      <h1>💥 Meme Clicker 3000: CHAOS ULTRA EDITION 💥</h1>
      <h2>{rankName}</h2>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <button onClick={handleClick} className="meme-button">
        🚀 Click Count: {count}
      </button>

      <p className="desc">
        🎯 Try tapping the teleporting emojis... if you can.
      </p>

      {emojis.map((e) => (
        <span
          key={e.id}
          className="floating-emoji"
          style={{ left: `${e.left}%`, top: `${e.top}%` }}
          onClick={() => handleEmojiClick(e.id)}
        >
          {e.emoji}
        </span>
      ))}
    </div>
  );
}

export default App;
