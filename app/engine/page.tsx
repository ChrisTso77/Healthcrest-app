import type { Metadata } from 'next';
import HealthEngineApp from '@/components/HealthEngineApp';
import type { SceneId } from '@/state/PillarsStateTypes';

export const metadata: Metadata = {
  title: 'Explore the engine | Healthcrest',
  description: 'Explore the connections between movement, food, sleep and stress through an interactive educational health engine.',
};

export default async function EnginePage({
  searchParams,
}: {
  searchParams: Promise<{ pillar?: string | string[] }>;
}) {
  const { pillar } = await searchParams;
  let initialScene: SceneId | undefined;
  switch (pillar) {
    case 'fitness': initialScene = 'fitness'; break;
    case 'nutrition': initialScene = 'nutrition'; break;
    case 'sleep': initialScene = 'sleep'; break;
    case 'stress': initialScene = 'stress'; break;
    case 'systems': initialScene = 'system'; break;
  }

  return <HealthEngineApp initialScene={initialScene} />;
}
