"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Activity,
  Leaf,
  Moon,
  HeartHandshake,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import { ModalDialog } from "@/components/ModalDialog";
import {
  pillarsReducer,
  initialPillarsState,
} from "@/state/PillarsStateMachine";
import { PILLAR_GUIDES } from "@/lib/education/healthGuide";
import { learningGuideHref } from "@/lib/education/learningGuides";
import { FALLBACK_PRESETS } from "@/lib/presets/fallback";
import { settingDelta } from "@/lib/education/settingComparison";
import { HABITS, STEPS, validSetting } from "./model";
import { HabitIllustration } from "./HabitIllustration";
const OptionalScene = dynamic(() => import("./OptionalScene"), { ssr: false });

export function ExplorerPrototype() {
  const [state, dispatch] = useReducer(pillarsReducer, {
    ...initialPillarsState,
    renderMode: "2d-canvas",
    activeScene: "fitness",
    activePillar: "Fitness",
  });
  const [habit, setHabit] = useState(0);
  const [step, setStep] = useState(0);
  const [intro, setIntro] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [three, setThree] = useState(false);
  const [paused, setPaused] = useState(true);
  const [support, setSupport] = useState("Talk with someone you trust");
  const [notice, setNotice] = useState("");
  const icons = [Activity, Leaf, Moon, HeartHandshake];
  const h = HABITS[habit];
  const guide = PILLAR_GUIDES[h.pillar];
  const value = state.parameters[h.key];
  const beginning = initialPillarsState.parameters[h.key];
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setIntro(location.hash !== "#explore"),
    );
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    if (!intro && !drawer) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [intro, drawer]);
  function closeIntro() {
    setIntro(false);
    history.replaceState(
      null,
      "",
      location.pathname + location.search + "#explore",
    );
  }
  function change(index: number, next: number) {
    if (validSetting(index, next))
      dispatch({
        type: "UPDATE_PARAM",
        payload: { key: HABITS[index].key, value: next },
      });
  }
  function control(index: number, prefix: string) {
    const setting = HABITS[index];
    return (
      <div className="ev2-control" key={setting.key}>
        <label htmlFor={prefix + setting.key}>
          {setting.label}{" "}
          <strong>
            {state.parameters[setting.key]} {setting.unit}
          </strong>
        </label>
        <input
          id={prefix + setting.key}
          type="range"
          min={setting.min}
          max={setting.max}
          step={setting.step}
          value={state.parameters[setting.key]}
          aria-valuetext={`${state.parameters[setting.key]} ${setting.unit}`}
          onChange={(e) => change(index, Number(e.target.value))}
        />
        <p>
          {setting.min}–{setting.max} {setting.unit}.{" "}
          {index === 3
            ? "Subjective rating, not a diagnosis."
            : index === 1
              ? "Illustrative setting, not a validated diet target."
              : "Scenario input, not a personal recommendation."}
        </p>
      </div>
    );
  }
  function reset() {
    dispatch({
      type: "RESTORE_PARAMETERS",
      payload: initialPillarsState.parameters,
    });
    setNotice("All example values reset to the opening scenario.");
  }
  return (
    <div className="ev2" data-habit={habit}>
      <a className="ev2-skip" href="#ev2-lesson">
        Skip to lesson
      </a>
      <header className="ev2-header">
        <Link href="/" prefetch={false} className="ev2-brand">
          healthcrest<span>Small habits. A clearer picture.</span>
        </Link>
        <div>
          <span className="ev2-tag">Explorer / Design preview</span>
          <button onClick={() => setIntro(true)}>Introduction</button>
        </div>
      </header>
      <main className="ev2-main">
        <div className="ev2-heading">
          <p className="ev2-eyebrow">THE HABIT EXPLORER</p>
          <h1>Small habits. A bigger picture.</h1>
          <p>
            A little understanding can go a long way. Choose a habit and make it
            your own learning journey.
          </p>
        </div>
        <nav aria-label="Choose a habit" className="ev2-habits">
          {HABITS.map((item, index) => (
            <button
              key={item.key}
              aria-pressed={habit === index}
              onClick={() => {
                setHabit(index);
                setStep(0);
                dispatch({ type: "SET_SCENE", payload: item.scene });
                setNotice("");
                document
                  .getElementById("ev2-title")
                  ?.focus({ preventScroll: true });
                document
                  .getElementById("ev2-lesson")
                  ?.scrollIntoView({ block: "start" });
              }}
            >
              <span className="ev2-icon" aria-hidden="true">
                {(() => {
                  const Icon = icons[index];
                  return <Icon size={26} />;
                })()}
              </span>
              <strong>{item.name}</strong>
              <span>{item.description}</span>
              <span className="ev2-explore">
                {habit === index ? "Exploring now" : "Explore habit"}{" "}
                <ArrowUpRight aria-hidden="true" size={14} />
              </span>
            </button>
          ))}
        </nav>
        <section
          id="ev2-lesson"
          aria-labelledby="ev2-title"
          className="ev2-lesson"
          tabIndex={-1}
        >
          <div className="ev2-section-head">
            <div>
              <p className="ev2-eyebrow">YOUR GUIDED LESSON</p>
              <h2 id="ev2-title" tabIndex={-1}>
                {h.name}
              </h2>
            </div>
            <button onClick={() => setDrawer(true)} aria-haspopup="dialog">
              Settings & scenarios
            </button>
          </div>
          <nav aria-label="Lesson steps" className="ev2-steps">
            {STEPS.map((name, index) => (
              <button
                key={name}
                aria-current={index === step ? "step" : undefined}
                onClick={() => setStep(index)}
              >
                <span>{index + 1}</span> {name}
              </button>
            ))}
          </nav>
          <div className="ev2-workspace">
            <div className="ev2-stage">
              <div className="ev2-section-head">
                <div>
                  <p className="ev2-eyebrow">ILLUSTRATIVE INPUT COMPARISON</p>
                  <h3>{h.label}</h3>
                </div>
                <button aria-pressed={three} onClick={() => setThree(!three)}>
                  {three ? "Hide optional 3D" : "Explore optional 3D"}
                </button>
              </div>
              {three && (
                <>
                  <OptionalScene state={state} paused={paused} />
                  <button
                    aria-pressed={!paused}
                    onClick={() => setPaused(!paused)}
                  >
                    {paused
                      ? "Play illustration motion"
                      : "Pause illustration motion"}
                  </button>
                  <p>{guide.visual}</p>
                </>
              )}
              <HabitIllustration
                habit={habit}
                value={value}
                beginning={beginning}
              />
              <div className="ev2-values">
                <p>
                  ○ Opening example{" "}
                  <strong>
                    {beginning} {h.unit}
                  </strong>
                </p>
                <p>
                  ◆ Current example{" "}
                  <strong>
                    {value} {h.unit}
                  </strong>
                </p>
              </div>
              <p className="ev2-delta" role="status">
                {settingDelta(beginning, value, h.changeUnit)} from opening
                example.
              </p>
              <p className="ev2-limit">
                These are selected inputs, not measured changes in health. Scale
                ends are slider limits, not targets. Higher is not always
                better. The optional 3D shapes are abstract metaphors, not
                anatomy or predictions.
              </p>
            </div>
            <div className="ev2-copy" aria-live="polite">
              <div className="ev2-lesson-icon" aria-hidden="true">
                {(() => {
                  const Icon = icons[habit];
                  return <Icon size={26} />;
                })()}
              </div>
              <p className="ev2-eyebrow">STEP {step + 1} OF 5</p>
              <h3>{STEPS[step]}</h3>
              {step === 0 && (
                <>
                  <p className="ev2-lead">{guide.goal}</p>
                  <p>
                    Select any lesson step, or choose another habit at any time.
                    Your example settings stay in place until you reset or
                    reload.
                  </p>
                </>
              )}
              {step === 1 && (
                <>
                  <p>
                    The outlined circle marks the opening example. The diamond
                    shows your current setting on the curved input scale. Change
                    the setting in Experiment or open Settings & scenarios to
                    compare examples.
                  </p>
                  <p>
                    Evidence describes general guidance; this diagram only
                    displays the numbers you choose. It does not estimate
                    benefits, risk or a combined health score.
                  </p>
                </>
              )}
              {step === 2 && (
                <>
                  {control(habit, "lesson-")}
                  <p>
                    Try another example and observe the marker. These example
                    values are not treatment goals.
                  </p>
                  <button
                    onClick={() => {
                      change(habit, h.examples[0]);
                      setNotice("Example A loaded for this habit only.");
                    }}
                  >
                    Example A · {h.examples[0]} {h.unit}
                  </button>
                  <button
                    onClick={() => {
                      change(habit, h.examples[1]);
                      setNotice("Example B loaded for this habit only.");
                    }}
                  >
                    Example B · {h.examples[1]} {h.unit}
                  </button>
                </>
              )}
              {step === 3 && (
                <>
                  <p className="ev2-lead">{guide.firstStep}</p>
                  {habit === 3 && (
                    <label className="ev2-support">
                      Choose a support example (does not change the numeric
                      model)
                      <select
                        value={support}
                        onChange={(e) => setSupport(e.target.value)}
                      >
                        <option>Talk with someone you trust</option>
                        <option>
                          Try a short, comfortable breathing practice
                        </option>
                        <option>Choose one manageable priority</option>
                      </select>
                      <span>
                        Example to consider: {support}. Choose what fits your
                        circumstances.
                      </span>
                    </label>
                  )}
                  <p>
                    Consider what would make this manageable in your day. This
                    is an educational example, not a personalised prescription.
                  </p>
                </>
              )}
              {step === 4 && (
                <>
                  <p>{guide.guidance}</p>
                  <p>
                    <a href={learningGuideHref(h.pillar)}>
                      Read the {h.name.toLowerCase()} guide →
                    </a>
                  </p>
                  <p>
                    <a href={guide.sourceUrl}>{guide.sourceLabel}</a>
                  </p>
                  <p>
                    General adult guidance checked 28 October 2026. The source
                    supports the guidance, not our slider values or illustrative
                    rules.
                  </p>
                </>
              )}
              {step < 4 && (
                <button
                  className="ev2-primary"
                  onClick={() => setStep(step + 1)}
                >
                  {
                    [
                      "Explore the illustration",
                      "Try an example",
                      "Find a practical idea",
                      "Go a little deeper",
                    ][step]
                  }{" "}
                  <span aria-hidden="true">→</span>
                </button>
              )}
              <div className="ev2-pagination">
                <button disabled={step === 0} onClick={() => setStep(step - 1)}>
                  ← Previous
                </button>
                <span>{step + 1} / 5</span>
                <button disabled={step === 4} onClick={() => setStep(step + 1)}>
                  Next →
                </button>
              </div>
            </div>
          </div>
          <div className="ev2-deeper-heading">
            <h3>A little more context</h3>
            <p>Open what interests you. Leave the rest for later.</p>
          </div>
          <div className="ev2-accordion">
            <details>
              <summary>Why this matters</summary>
              <p>{guide.goal}</p>
            </details>
            <details>
              <summary>How the illustration works</summary>
              <p>
                The default diagram displays input values without a health
                formula.
              </p>
              <p>{guide.visual}</p>
            </details>
            <details>
              <summary>Practical guidance</summary>
              <p>{guide.firstStep}</p>
            </details>
            <details>
              <summary>Scientific evidence and limits</summary>
              <p>{guide.guidance}</p>
              <a href={guide.sourceUrl}>{guide.sourceLabel}</a>
              <p>
                General adult guidance checked 28 October 2026; illustrative
                settings and thresholds are not clinically validated.
              </p>
            </details>
          </div>
        </section>
        <p role="status" className="ev2-notice">
          {notice}
        </p>
        <footer className="ev2-footer">
          Educational prototype · no account required · example settings stay in
          page memory only. Reload resets them. Not a medical assessment.{" "}
          <details className="ev2-original-link">
            <summary>Compare with the original Explorer</summary>
            <p>
              This redesigned prototype is at{" "}
              <code>/prototype/explorer-v2</code>. The separate{" "}
              <a href="/engine">original Explorer</a> retains its previous UI.
            </p>
          </details>
        </footer>
      </main>
      {intro && (
        <ModalDialog
          labelledBy="ev2-intro-title"
          onClose={closeIntro}
          className="ev2-modal"
        >
          <div className="ev2-dialog-content">
            <p className="ev2-eyebrow">WELCOME TO THE EXPLORER</p>
            <h2 id="ev2-intro-title">Four habits. Room to explore.</h2>
            <p>
              Movement, food, sleep, and stress and social support are starting
              points for learning, not a complete model of health.
            </p>
            <ol>
              <li>Choose a habit card to open its five-step lesson.</li>
              <li>
                Compare opening and current example values in the central
                diagram.
              </li>
              <li>
                Try a slider in Experiment. Open Settings & scenarios for more
                options.
              </li>
            </ol>
            <p>
              Illustrations show selected settings, not your body, diagnosis or
              predicted health. Optional 3D is an abstract metaphor.
            </p>
            <p>
              Start or Skip adds #explore to this URL so returning to it skips
              the introduction. No preference or health values are saved to
              device storage. Reopen with Introduction at any time.
            </p>
            <button onClick={closeIntro}>Start exploring</button>
            <button onClick={closeIntro}>Skip introduction</button>
          </div>
        </ModalDialog>
      )}
      {drawer && (
        <ModalDialog
          labelledBy="ev2-drawer-title"
          onClose={() => setDrawer(false)}
          className="ev2-modal ev2-drawer"
        >
          <div className="ev2-dialog-content">
            <button onClick={() => setDrawer(false)}>Close settings</button>
            <h2 id="ev2-drawer-title">{h.name} settings</h2>
            <p>
              Illustrative example inputs. Closing this panel keeps your changes
              in page memory.
            </p>
            {control(habit, "drawer-")}
            <h3>Compare this habit only</h3>
            <p>
              Neutral comparisons drawn from existing scenario values; not
              recommended targets. Other settings stay unchanged.
            </p>
            {h.examples.map((n, index) => (
              <button
                key={n}
                onClick={() => {
                  change(habit, n);
                  setNotice(
                    `Example ${index === 0 ? "A" : "B"} loaded for this habit only.`,
                  );
                }}
              >
                Example {index === 0 ? "A" : "B"} · {n} {h.unit}
              </button>
            ))}
            <button
              onClick={() => {
                change(habit, beginning);
                setNotice("This habit reset to its opening value.");
              }}
            >
              Reset this habit
            </button>
            <details>
              <summary>Advanced · other inputs and full scenarios</summary>
              <p>
                These are the original Explorer’s four bounded controls.
                Changing another habit here does not switch the lesson.
              </p>
              {HABITS.map(
                (_, index) => index !== habit && control(index, "advanced-"),
              )}
              <h3>Reviewed built-in scenarios</h3>
              <p>
                Loading a full scenario replaces ALL example inputs. Evidence
                labels apply to general guidance, not predicted outcomes.
                Experimental sleep examples remain research-only.
              </p>
              {FALLBACK_PRESETS.filter((p) => p.pillar === h.pillar).map(
                (p) => (
                  <div key={p.id}>
                    <button
                      onClick={() => {
                        dispatch({
                          type: "APPLY_CANONICAL_PRESET",
                          payload: p,
                        });
                        dispatch({ type: "SET_SCENE", payload: h.scene });
                        setNotice(
                          `Loaded full scenario: ${p.title}. All example inputs replaced.`,
                        );
                      }}
                    >
                      {p.title} · {p.evidenceLevel}
                    </button>
                    <details>
                      <summary>{p.title}: sources and limits</summary>
                      <p>{p.education?.limitations}</p>
                      <p>
                        Source check: {p.education?.checkedOn ?? "Not recorded"}
                      </p>
                      {p.education?.sources.map((source) => (
                        <section key={source.url}>
                          <a href={source.url}>{source.title}</a>
                          <p>Population: {source.population}</p>
                          <p>Supports: {source.supports}</p>
                          <p>Limits: {source.limitations}</p>
                        </section>
                      ))}
                    </details>
                  </div>
                ),
              )}
              {habit === 1 && (
                <p>
                  No reviewed Food built-in scenario is available; use the
                  neutral comparisons above.
                </p>
              )}
              <button onClick={reset}>Reset all example values</button>
            </details>
            <p role="status">{notice}</p>
          </div>
        </ModalDialog>
      )}
    </div>
  );
}
