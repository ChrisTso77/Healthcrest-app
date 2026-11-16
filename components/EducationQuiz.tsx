'use client';

import { useId, useState } from 'react';
import type { Lesson } from '@/lib/education/library/types';

export function EducationQuiz({ quiz }: { quiz: Lesson['quiz'] }) {
  const id = useId();
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  return <form className="hc-education-quiz" onSubmit={event => { event.preventDefault(); setChecked(true); }}>
    <fieldset>
      <legend>{quiz.question}</legend>
      {quiz.options.map((option, index) => <label key={option}>
        <input type="radio" name={id} checked={choice === index} onChange={() => { setChoice(index); setChecked(false); }} />{option}
      </label>)}
    </fieldset>
    <button type="submit" disabled={choice === null}>Check my understanding</button>
    <p role="status">{checked ? (choice === quiz.answer ? 'That is right. ' : 'Consider the explanation. ') + quiz.explanation : 'Choose an answer. Nothing is saved or scored as a health assessment.'}</p>
    <p>Interactive checking needs JavaScript. You can always read the explanation below.</p>
    <details><summary>Read the answer explanation</summary><p>{quiz.explanation}</p></details>
  </form>;
}
