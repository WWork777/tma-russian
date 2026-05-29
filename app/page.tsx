"use client";

import { useEffect, useState } from "react";
import { words } from "../data/words";

export default function Home() {

  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  function getRandomWord() {

    const randomWord =
      words[Math.floor(Math.random() * words.length)];

    setCurrentWord(randomWord);

    setInput("");
    setResult("");

    speakWord(randomWord);
  }

  function speakWord(word: string) {

    const utterance =
      new SpeechSynthesisUtterance(word);

    utterance.lang = "ru-RU";
    utterance.rate = 0.9;

    speechSynthesis.speak(utterance);
  }

function checkWord() {

  if (result !== "") {
    getRandomWord();
    return;
  }

  if (
    input.toLowerCase() ===
    currentWord.toLowerCase()
  ) {

    setResult("✅ Правильно");

  } else {

    setResult(`❌ ${currentWord}`);
  }
}

  useEffect(() => {
    getRandomWord();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-8 px-4">

      <button
        onClick={() => speakWord(currentWord)}
        className="text-7xl"
      >
        🔊
      </button>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
        if (e.key === "Enter") {
          checkWord();
        }
      }}
        placeholder="Введите слово"
        className="bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-4 text-3xl outline-none w-full max-w-xl"
      />

      <div className="text-3xl h-10">
        {result}
      </div>

      <div className="flex gap-4">

        <button
          onClick={checkWord}
          className="bg-white text-black px-6 py-3 rounded-xl font-bold text-xl"
        >
          Проверить
        </button>

        <button
          onClick={getRandomWord}
          className="bg-zinc-800 px-6 py-3 rounded-xl text-xl"
        >
          Следующее
        </button>

      </div>

    </main>
  );
}