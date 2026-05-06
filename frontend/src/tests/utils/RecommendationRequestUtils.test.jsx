import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/RecommendationRequestUtils";
import { toast } from "react-toastify";
import { vi } from "vitest";

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

describe("RecommendationRequestUtils tests", () => {
  describe("onDeleteSuccess", () => {
    test("It puts the message on console.log and in a toast", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      onDeleteSuccess("abc");
      expect(toast).toHaveBeenCalledWith("abc");
      expect(consoleSpy).toHaveBeenCalledWith("abc");
      consoleSpy.mockRestore();
    });
  });

  describe("cellToAxiosParamsDelete", () => {
    test("It returns the correct params", () => {
      const cell = { row: { original: { id: 17 } } };
      const result = cellToAxiosParamsDelete(cell);
      expect(result).toEqual({
        url: "/api/recommendationrequest",
        method: "DELETE",
        params: { id: 17 },
      });
    });
  });
});
