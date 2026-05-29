"use client";

import { useEffect, useState } from "react";
import { words } from "../data/words";

const SESSION_SIZE = 20;

export default function Home() {
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const [index, setIndex] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  function speakWord(word: string) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "ru-RU";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  }

  function getRandomWord() {
    let word: string;

    if (queue.length > 0) {
      word = queue[0];
      setQueue(prev => prev.slice(1));
    } else {
      word = words[Math.floor(Math.random() * words.length)];
    }

    setCurrentWord(word);
    setInput("");
    setResult("");

    speakWord(word);
  }

  function checkWord() {
    if (finished) return;

    const userAnswer = input.trim().toLowerCase();
    const correctAnswer = currentWord.trim().toLowerCase();

    const correct = userAnswer === correctAnswer;

    if (!correct) {
      setErrors(prev => [...prev, currentWord]);
      setQueue(prev => [...prev, currentWord]);
      setResult(`❌ ${currentWord}`);
    } else {
      setResult("✅ Правильно");
    }

    const nextIndex = index + 1;

    if (nextIndex >= SESSION_SIZE) {
      setFinished(true);
    } else {
      setIndex(nextIndex);
      getRandomWord();
    }

    setInput("");
  }

  useEffect(() => {
    getRandomWord();
  }, []);

  if (finished) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 px-4">
        <h1 className="text-3xl font-bold">Сессия закончена 🎉</h1>

        <div className="text-xl">
          Ошибки:
        </div>

        <ul className="text-red-400 text-lg">
          {errors.length === 0 ? (
            <li>нет ошибок 🔥</li>
          ) : (
            errors.map((e, i) => <li key={i}>{e}</li>)
          )}
        </ul>

        <button
          className="bg-white text-black px-6 py-3 rounded-xl font-bold"
          onClick={() => {
            setIndex(0);
            setErrors([]);
            setQueue([]);
            setFinished(false);
            setResult("");
            setInput("");
            getRandomWord();
          }}
        >
          начать заново
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-8 px-4">

      {/* ПРОГРЕСС */}
      <div className="w-full max-w-xl">
        <div className="text-xl mb-2 text-center">
          {index} / {SESSION_SIZE}
        </div>

        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all"
            style={{
              width: `${(index / SESSION_SIZE) * 100}%`
            }}
          />
        </div>
      </div>

      {/* ОЗВУЧКА */}
      <button
        onClick={() => speakWord(currentWord)}
        className="text-7xl"
      >
        🔊
      </button>

      {/* INPUT */}
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

      {/* РЕЗУЛЬТАТ */}
      <div className="text-3xl h-10">
        {result}
      </div>

      {/* КНОПКИ */}
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