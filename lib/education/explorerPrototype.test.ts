import { describe, it, expect } from "vitest";
import { HABITS, validSetting } from "@/components/explorer-v2/model";
import { COMPARED_SETTINGS } from "./settingComparison";
import {
  pillarsReducer,
  initialPillarsState,
} from "@/state/PillarsStateMachine";
describe("isolated prototype input contract", () => {
  it("retains original ranges and rejects invalid, fractional-step and nonfinite values", () => {
    HABITS.forEach((habit, index) => {
      expect([habit.key, habit.min, habit.max, habit.unit]).toEqual([
        COMPARED_SETTINGS[index].key,
        COMPARED_SETTINGS[index].min,
        COMPARED_SETTINGS[index].max,
        COMPARED_SETTINGS[index].unit,
      ]);
      for (const value of [habit.min, habit.max, ...habit.examples])
        expect(validSetting(index, value)).toBe(true);
      for (const value of [
        NaN,
        Infinity,
        habit.min - 1,
        habit.max + 1,
        habit.min + habit.step / 2,
      ])
        expect(validSetting(index, value)).toBe(false);
    });
    expect(validSetting(4, 1)).toBe(false);
  });
  it("switching habits preserves independent choices and resets use the unchanged canonical reducer", () => {
    const edited = pillarsReducer(initialPillarsState, {
      type: "UPDATE_PARAM",
      payload: { key: "aerobicVolume", value: 300 },
    });
    const switched = pillarsReducer(edited, {
      type: "SET_SCENE",
      payload: "sleep",
    });
    expect(switched.parameters.aerobicVolume).toBe(300);
    expect(
      pillarsReducer(switched, {
        type: "RESTORE_PARAMETERS",
        payload: initialPillarsState.parameters,
      }).parameters,
    ).toEqual(initialPillarsState.parameters);
  });
});
