"use client";

import { useEffect, useState } from "react";
import { egeWords12 } from "../../data/words";

const SESSION_SIZE = 10;

type Step = "conjugation" | "letter" | "result";

export default function Task12() {
  const [session, setSession] = useState<typeof egeWords12>([]);
  const [index, setIndex] = useState(0);

  const [current, setCurrent] = useState(egeWords12[0]);

  const [step, setStep] = useState<Step>("conjugation");

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  function shuffle<T>(arr: T[]) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function startSession() {
    const selected = shuffle(egeWords12).slice(0, SESSION_SIZE);

    setSession(selected);
    setIndex(0);
    setCurrent(selected[0]);

    setErrors([]);
    setFinished(false);
    setMessage("");

    if (selected[0].conjugation === 0) {
      setStep("letter");
    } else {
      setStep("conjugation");
    }
  }

  useEffect(() => {
    startSession();
  }, []);

  function nextWord() {
    const next = index + 1;

    if (next >= SESSION_SIZE) {
      setFinished(true);
      return;
    }

    const word = session[next];

    setIndex(next);
    setCurrent(word);
    setMessage("");

    if (word.conjugation === 0) {
      setStep("letter");
    } else {
      setStep("conjugation");
    }
  }

  function chooseConjugation(choice: number) {
    if (choice === current.conjugation) {
      setStep("letter");
      return;
    }

    setErrors((prev) => [...prev, current.word]);

    setMessage(
      `❌ Неверно

Правильное спряжение: ${current.conjugation}

${current.explanation}`
    );

    setStep("result");
  }

  function chooseLetter(letter: string) {
    if (letter === current.answer) {
      setMessage(
        `✅ Правильно

${current.explanation}`
      );
    } else {
      setErrors((prev) => [...prev, current.word]);

      setMessage(
        `❌ Неверно

Правильная буква: ${current.answer}

${current.explanation}`
      );
    }

    setStep("result");
  }

  if (finished) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">

        <h1 className="text-3xl font-bold">
          Сессия завершена 🎉
        </h1>

        <div>
          Ошибок: {errors.length}
        </div>

        <ul className="text-red-400">
          {errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>

        <button
          onClick={startSession}
          className="bg-white text-black px-6 py-3 rounded-xl"
        >
          Начать заново
        </button>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-center items-center gap-8 px-4">

      <div className="text-xl">
        {index + 1} / {SESSION_SIZE}
      </div>

      <div className="text-5xl font-bold">
        {current.word}
      </div>

      {step === "conjugation" && (
        <div className="flex gap-4">

          <button
            onClick={() => chooseConjugation(1)}
            className="bg-white text-black px-8 py-4 rounded-xl text-xl"
          >
            1 спр.
          </button>

          <button
            onClick={() => chooseConjugation(2)}
            className="bg-white text-black px-8 py-4 rounded-xl text-xl"
          >
            2 спр.
          </button>

        </div>
      )}

      {step === "letter" && (
        <div className="grid grid-cols-3 gap-4">

          {["а", "е", "и", "я", "ю", "у"].map((l) => (
            <button
              key={l}
              onClick={() => chooseLetter(l)}
              className="bg-white text-black text-3xl rounded-xl px-8 py-6"
            >
              {l.toUpperCase()}
            </button>
          ))}

        </div>
      )}

      {step === "result" && (
        <div className="flex flex-col gap-6 items-center">

          <pre className="whitespace-pre-wrap text-center text-xl">
            {message}
          </pre>

          <button
            onClick={nextWord}
            className="bg-white text-black px-8 py-3 rounded-xl"
          >
            Далее
          </button>

        </div>
      )}

    </main>
  );
}