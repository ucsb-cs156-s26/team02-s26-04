import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router";
import { expect } from "vitest";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("MenuItemReviewForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByText(/Item Id/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/Item Id/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a MenuItemReview", async () => {
    render(
      <Router>
        <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneReview} />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-id");
    expect(screen.getByText(/^Id$/)).toBeInTheDocument();
    expect(screen.getByTestId("MenuItemReviewForm-id")).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-stars");
    const starsField = screen.getByTestId("MenuItemReviewForm-stars");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(starsField, { target: { value: "6" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Stars must be between 1 and 5./);
    expect(
      screen.getByText(/Stars must be between 1 and 5./),
    ).toBeInTheDocument();
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-submit");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Item Id is required./);
    expect(screen.getByText(/Reviewer Email is required./)).toBeInTheDocument();
    expect(
      screen.getByText(/Stars must be between 1 and 5./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required./)).toBeInTheDocument();
    expect(screen.getByText(/Comments are required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <MenuItemReviewForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-itemId");

    const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
    const reviewerEmailField = screen.getByTestId(
      "MenuItemReviewForm-reviewerEmail",
    );
    const starsField = screen.getByTestId("MenuItemReviewForm-stars");
    const dateReviewedField = screen.getByTestId(
      "MenuItemReviewForm-dateReviewed",
    );
    const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(itemIdField, { target: { value: "1" } });
    fireEvent.change(reviewerEmailField, {
      target: { value: "tladha@ucsb.edu" },
    });
    fireEvent.change(starsField, { target: { value: "5" } });
    fireEvent.change(dateReviewedField, {
      target: { value: "2026-04-30T12:00:00" },
    });
    fireEvent.change(commentsField, { target: { value: "Super yummy!" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/Item Id is required./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Reviewer Email is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Stars must be between 1 and 5./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Date Reviewed is required./),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Comments are required./)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-cancel");
    const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
