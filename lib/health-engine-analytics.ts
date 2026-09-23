/**
 * THE FOUR PILLARS HEALTH ENGINE - CUSTOM ANALYTICS TRACKER
 * Modular analytics abstraction layer for tracking user engagement,
 * scenario preset activations, parameter slider changes, and scene transitions.
 * Supports Google Analytics 4, Plausible, and PostHog.
 */

export type PillarType = 'Fitness' | 'Nutrition' | 'Sleep' | 'Stress' | 'Systems';
export type HealthStatus = 'optimal' | 'warning' | 'critical';
export type RenderMode = 'high-3d' | 'lite-3d' | '2d-canvas';

// Window extension for global analytics providers
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (eventName: string, options?: { props?: Record<string, any> }) => void;
    posthog?: { capture: (eventName: string, properties?: Record<string, any>) => void };
  }
}

/**
 * Universal Event Dispatcher
 * Sends structured events to whichever provider is active in window
 */
export const trackEvent = (eventName: string, props: Record<string, any> = {}) => {
  // Console logging in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics Event: ${eventName}]`, props);
  }

  // Google Analytics 4 (gtag.js)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, props);
  }

  // Plausible Analytics
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props });
  }

  // PostHog
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture(eventName, props);
  }
};

/**
 * Health Engine Event Helpers
 */
export const HealthEngineAnalytics = {
  /**
   * Tracks active pillar tab switching
   */
  trackPillarSelect: (pillar: PillarType) => {
    trackEvent('pillar_selected', {
      pillar_name: pillar,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Tracks when a user loads a scenario preset (e.g. Overtrained & Sleep Deprived)
   */
  trackPresetLoaded: (presetId: string, title: string, pillar: PillarType, status: HealthStatus) => {
    trackEvent('scenario_preset_loaded', {
      preset_id: presetId,
      preset_title: title,
      pillar,
      health_status: status,
    });
  },

  /**
   * Tracks live parameter slider adjustments (debounced)
   */
  trackParameterAdjust: (parameterName: string, value: number) => {
    trackEvent('parameter_adjusted', {
      parameter: parameterName,
      new_value: value,
    });
  },

  /**
   * Tracks 3D Storyboard scene camera transitions
   */
  trackSceneChange: (sceneNumber: number, sceneTitle: string, pillar: PillarType) => {
    trackEvent('storyboard_scene_viewed', {
      scene_number: sceneNumber,
      scene_title: sceneTitle,
      associated_pillar: pillar,
    });
  },

  /**
   * Tracks hardware render mode switching (High 3D vs Lite 3D vs 2D Canvas)
   */
  trackRenderModeSwitch: (mode: RenderMode) => {
    trackEvent('render_mode_switched', {
      selected_mode: mode,
    });
  },

  /**
   * Tracks interactions with the Medico-Legal Disclaimer modal
   */
  trackDisclaimerAction: (action: 'opened' | 'closed' | 'accepted') => {
    trackEvent('disclaimer_interaction', {
      action_type: action,
    });
  },
};

export default HealthEngineAnalytics;
