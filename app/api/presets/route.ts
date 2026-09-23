import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

/**
 * NEXT.JS APP ROUTER API ROUTE (v3)
 * Path: app/api/presets/route.ts or app/api/presets/[slug]/route.ts
 * 
 * Fetches Scenario Presets, Scene 5 Storyboards, Sleep Ladder data, and Global Narrative from Sanity CMS
 * and formats them for consumption by PillarsStateMachine.tsx, HealthEngineHUD.tsx, and page.tsx
 */

// Initialize Sanity Client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your_project_id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
});

// GROQ Query to fetch all scenario presets with linked pillar & evidence details
const ALL_PRESETS_QUERY = `
  *[_type == "scenarioPreset"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    healthStatus,
    evidenceLevel,
    parameters {
      aerobicMins,
      strengthDays,
      sleepDuration,
      wholeFoodRatio,
      stressLevel,
      alcoholUnits
    },
    visualProps {
      coreColor,
      emissiveIntensity,
      wobbleSpeed,
      wobbleFactor,
      particleDensity
    },
    narrativeOverlay {
      headline,
      body,
      outcomes
    },
    "pillar": pillar->{
      _id,
      title,
      "slug": slug.current,
      accentColor
    }
  }
`;

// GROQ Query to fetch storyboard scenes (e.g. Scene 5 Systems Engine)
const STORYBOARD_SCENES_QUERY = `
  *[_type == "storyboardScene"] | order(sceneNumber asc) {
    _id,
    sceneNumber,
    title,
    visualMetaphor,
    "associatedPillar": associatedPillar->{
      _id,
      title,
      "slug": slug.current
    },
    "presets": presets[]->{
      _id,
      title,
      "slug": slug.current,
      healthStatus,
      evidenceLevel,
      parameters,
      visualProps,
      narrativeOverlay
    }
  }
`;

// GROQ Query to fetch Global Narrative singleton document
const GLOBAL_NARRATIVE_QUERY = `
  *[_type == "globalNarrative"][0] {
    _id,
    bottomLine,
    pillarsSummary,
    clinicalAlignment
  }
`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const scene = searchParams.get('scene');
    const narrative = searchParams.get('narrative') || searchParams.get('type') === 'narrative';

    // If query requests global narrative content
    if (narrative) {
      const globalNarrative = await sanityClient.fetch(
        GLOBAL_NARRATIVE_QUERY,
        {},
        {
          next: {
            revalidate: 300,
            tags: ['global-narrative'],
          },
        }
      );

      if (!globalNarrative) {
        return NextResponse.json(
          { error: 'Global narrative content not found in Sanity' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: globalNarrative });
    }

    // If query requests a specific scene (e.g. ?scene=5)
    if (scene) {
      const sceneNum = parseInt(scene, 10);
      const scenes = await sanityClient.fetch(
        STORYBOARD_SCENES_QUERY,
        {},
        {
          next: {
            revalidate: 300,
            tags: ['storyboard-scenes'],
          },
        }
      );

      const targetScene = scenes.find((s: any) => s.sceneNumber === sceneNum);

      if (!targetScene) {
        return NextResponse.json(
          { error: `Storyboard scene number '${scene}' not found` },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: targetScene });
    }

    // If query requests a specific preset by slug
    if (slug) {
      const presets = await sanityClient.fetch(ALL_PRESETS_QUERY);
      const preset = presets.find((p: any) => p.slug === slug);

      if (!preset) {
        return NextResponse.json(
          { error: `Scenario preset with slug '${slug}' not found` },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: preset });
    }

    // Default: Fetch all scenario presets
    const presets = await sanityClient.fetch(
      ALL_PRESETS_QUERY,
      {},
      {
        next: {
          revalidate: 300,
          tags: ['presets'],
        },
      }
    );

    return NextResponse.json({
      success: true,
      count: presets.length,
      data: presets,
    });
  } catch (error) {
    console.error('Failed to fetch scenario presets from Sanity:', error);
    return NextResponse.json(
      { error: 'Internal Server Error fetching scenario presets' },
      { status: 500 }
    );
  }
}
