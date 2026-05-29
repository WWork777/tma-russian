"use client";

import { useEffect, useState } from "react";
import { words } from "../data/words";

const SESSION_SIZE = 10;

export default function Home() {
  const [sessionWords, setSessionWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const [errors, setErrors] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  function speakWord(word: string) {
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "ru-RU";
    u.rate = 0.9;
    speechSynthesis.speak(u);
  }

  function shuffle(arr: string[]) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function startSession() {
    const selected = shuffle(words).slice(0, SESSION_SIZE);

    setSessionWords(selected);
    setCurrentIndex(0);
    setErrors([]);
    setFinished(false);
    setResult("");
    setInput("");

    setCurrentWord(selected[0]);
    speakWord(selected[0]);
  }

  function checkWord() {
    if (finished) return;

    const ok =
      input.trim().toLowerCase() === currentWord.trim().toLowerCase();

    const newErrors = ok ? errors : [...errors, currentWord];

    if (!ok) setResult(`❌ ${currentWord}`);
    else setResult("✅ Правильно");

    const next = currentIndex + 1;

    if (next >= SESSION_SIZE) {
      setFinished(true);
      setErrors(newErrors);
      return;
    }

    setErrors(newErrors);
    setCurrentIndex(next);

    const nextWord = sessionWords[next];
    setCurrentWord(nextWord);

    setInput("");
    speakWord(nextWord);
  }

  useEffect(() => {
    startSession();
  }, []);

  if (finished) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl">Готово 🎉</h1>

        <ul className="text-red-400 mt-4">
          {errors.length === 0 ? (
            <li>нет ошибок 🔥</li>
          ) : (
            errors.map((e, i) => <li key={i}>{e}</li>)
          )}
        </ul>

        <button
          onClick={startSession}
          className="mt-6 bg-white text-black px-6 py-3"
        >
          заново
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">

      <div>{currentIndex} / {SESSION_SIZE}</div>

      <button onClick={() => speakWord(currentWord)} className="text-6xl">
        🔊
      </button>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && checkWord()}
        className="bg-zinc-900 px-4 py-3 text-2xl"
        placeholder="слово"
      />

      <div>{result}</div>

      <button
        onClick={checkWord}
        className="bg-white text-black px-4 py-2"
      >
        проверить
      </button>
    </main>
  );
}