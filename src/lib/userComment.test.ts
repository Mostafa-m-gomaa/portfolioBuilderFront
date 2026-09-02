import { describe, expect, it } from "vitest";
import { canPromptUserComment, needsUserComment } from "./userComment";

describe("userComment", () => {
  it("requires a submitted comment flag before prompting", () => {
    expect(needsUserComment({ hasComment: false })).toBe(true);
    expect(needsUserComment({ hasComment: true })).toBe(false);
  });

  it("blocks feedback until the dashboard tour is completed", () => {
    expect(
      canPromptUserComment({ hasComment: false, takeTour: false }),
    ).toBe(false);
    expect(
      canPromptUserComment({ hasComment: false, takeTour: undefined }),
    ).toBe(false);
    expect(
      canPromptUserComment({ hasComment: false, takeTour: true }),
    ).toBe(true);
    expect(
      canPromptUserComment({ hasComment: true, takeTour: true }),
    ).toBe(false);
  });
});
