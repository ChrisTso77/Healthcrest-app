export type Habit = 'movement' | 'food' | 'sleep' | 'stress';
export type Audience = 'adults' | 'teens' | 'older' | 'beginner' | 'access' | 'resources' | 'advanced';
export type Region = 'global' | 'uk' | 'eu' | 'us';
export type Block = { id: string; title: string; text: string; claimIds: string[] };
export type Lesson = {
  id: Habit; title: string; subtitle: string; summary: Block; takeaways: Block[];
  practical: Block[]; science: Block[]; faqs: Block[]; safety: Block;
  glossary: { term: string; meaning: string }[];
  diagram: { title: string; description: string; labels: string[]; claimIds: string[] };
  quiz: { question: string; options: string[]; answer: number; explanation: string; claimIds: string[] };
  video: { objective: string; scenes: { seconds: number; visual: string; narration: string; claimIds: string[] }[] };
};
