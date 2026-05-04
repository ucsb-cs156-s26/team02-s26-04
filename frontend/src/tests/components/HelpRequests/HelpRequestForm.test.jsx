import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router";

import HelpRequestForm from "main/components/HelpRequests/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
/* Stryker disable all */
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});
/* Stryker restore all */

const queryClient = new QueryClient();
const testId = "HelpRequestForm";

async function helpRequestFormRendersWithNoInitialContents() {
  render(
    <QueryClientProvider client={queryClient}>
      <Router>
        <HelpRequestForm />
      </Router>
    </QueryClientProvider>,
  );

  expect(await screen.findByText(/Create/)).toBeInTheDocument();

  expect(screen.getByText("Requester Email")).toBeInTheDocument();
  expect(screen.getByText("Team Id")).toBeInTheDocument();
  expect(screen.getByText("Table or Breakout Room")).toBeInTheDocument();
  expect(screen.getByText("Request Time (iso format)")).toBeInTheDocument();
  expect(screen.getByText("Explanation")).toBeInTheDocument();
  expect(screen.getByText("Solved")).toBeInTheDocument();

  expect(screen.getByTestId(`${testId}-requesterEmail`)).toBeInTheDocument();
  expect(screen.getByTestId(`${testId}-teamId`)).toBeInTheDocument();
  expect(
    screen.getByTestId(`${testId}-tableOrBreakoutRoom`),
  ).toBeInTheDocument();
  expect(screen.getByTestId(`${testId}-requestTime`)).toBeInTheDocument();
  expect(screen.getByTestId(`${testId}-explanation`)).toBeInTheDocument();
  expect(screen.getByTestId(`${testId}-solved`)).toBeInTheDocument();
  expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();
  expect(screen.getByTestId(`${testId}-cancel`)).toBeInTheDocument();

  expect(screen.queryByText(/Request Time is required/)).not.toBeInTheDocument();
}

/* Stryker disable BlockStatement */
test("renders correctly with no initialContents", async () => {
  await helpRequestFormRendersWithNoInitialContents();
  expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
});
/* Stryker restore BlockStatement */

async function helpRequestFormRendersWithInitialContents() {
  const initialContents = {
    ...helpRequestFixtures.oneHelpRequest,
    requestTime: "2026-04-29T12:00:00.000Z",
  };

  render(
    <QueryClientProvider client={queryClient}>
      <Router>
        <HelpRequestForm initialContents={initialContents} />
      </Router>
    </QueryClientProvider>,
  );

  expect(await screen.findByText(/Create/)).toBeInTheDocument();

  expect(screen.getByText("Requester Email")).toBeInTheDocument();
  expect(screen.getByText("Team Id")).toBeInTheDocument();
  expect(screen.getByText("Table or Breakout Room")).toBeInTheDocument();
  expect(screen.getByText("Request Time (iso format)")).toBeInTheDocument();
  expect(screen.getByText("Explanation")).toBeInTheDocument();
  expect(screen.getByText("Solved")).toBeInTheDocument();

  expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
  expect(screen.getByText("Id")).toBeInTheDocument();

  expect(screen.getByTestId(`${testId}-requesterEmail`)).toBeInTheDocument();
  expect(screen.getByTestId(`${testId}-teamId`)).toBeInTheDocument();
  expect(
    screen.getByTestId(`${testId}-tableOrBreakoutRoom`),
  ).toBeInTheDocument();
  expect(screen.getByTestId(`${testId}-requestTime`)).toBeInTheDocument();
  expect(screen.getByTestId(`${testId}-explanation`)).toBeInTheDocument();
  expect(screen.getByTestId(`${testId}-solved`)).toBeInTheDocument();
  expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();
  expect(screen.getByTestId(`${testId}-cancel`)).toBeInTheDocument();

  expect(screen.getByTestId(`${testId}-id`)).toHaveValue("1");
  expect(screen.getByTestId(`${testId}-requesterEmail`)).toHaveValue(
    initialContents.requesterEmail,
  );
  expect(screen.getByTestId(`${testId}-teamId`)).toHaveValue(
    initialContents.teamId,
  );
  expect(screen.getByTestId(`${testId}-tableOrBreakoutRoom`)).toHaveValue(
    initialContents.tableOrBreakoutRoom,
  );
  expect(screen.getByTestId(`${testId}-requestTime`)).toHaveValue(
    "2026-04-29T12:00",
  );
  expect(screen.getByTestId(`${testId}-requestTime`).value).not.toContain("Z");
  expect(screen.getByTestId(`${testId}-explanation`)).toHaveValue(
    initialContents.explanation,
  );
  expect(screen.getByTestId(`${testId}-solved`)).not.toBeChecked();

  expect(screen.queryByText(/Request Time is required/)).not.toBeInTheDocument();
}

/* Stryker disable BlockStatement */
test("renders correctly when passing in initialContents", async () => {
  await helpRequestFormRendersWithInitialContents();
  expect(screen.getByTestId(`${testId}-id`)).toHaveValue("1");
});
/* Stryker restore BlockStatement */

async function helpRequestFormCancelCallsNavigateBack() {
  mockedNavigate.mockClear();
  render(
    <QueryClientProvider client={queryClient}>
      <Router>
        <HelpRequestForm />
      </Router>
    </QueryClientProvider>,
  );
  expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
  const cancelButton = screen.getByTestId(`${testId}-cancel`);

  fireEvent.click(cancelButton);

  expect(mockedNavigate).toHaveBeenCalledWith(-1);
}

/* Stryker disable BlockStatement */
test("that navigate(-1) is called when Cancel is clicked", async () => {
  await helpRequestFormCancelCallsNavigateBack();
  expect(mockedNavigate).toHaveBeenCalledTimes(1);
});
/* Stryker restore BlockStatement */

async function helpRequestFormValidationMessages() {
  render(
    <QueryClientProvider client={queryClient}>
      <Router>
        <HelpRequestForm />
      </Router>
    </QueryClientProvider>,
  );

  expect(await screen.findByText(/Create/)).toBeInTheDocument();
  const submitButton = screen.getByText(/Create/);
  fireEvent.click(submitButton);

  await screen.findByText(/Requester Email is required/);
  expect(screen.getByText(/Team Id is required/)).toBeInTheDocument();
  expect(
    screen.getByText(/Table or Breakout Room is required/),
  ).toBeInTheDocument();
  expect(screen.getByText(/Request Time is required/)).toBeInTheDocument();
  expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
}

/* Stryker disable BlockStatement */
test("that the correct validations are performed", async () => {
  await helpRequestFormValidationMessages();
  expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
});
/* Stryker restore BlockStatement */

async function helpRequestFormRequesterEmailMaxLength() {
  const user = userEvent.setup();

  render(
    <QueryClientProvider client={queryClient}>
      <Router>
        <HelpRequestForm />
      </Router>
    </QueryClientProvider>,
  );

  expect(
    await screen.findByTestId(`${testId}-requesterEmail`),
  ).toBeInTheDocument();

  await user.type(
    screen.getByTestId(`${testId}-requesterEmail`),
    "a".repeat(31),
  );
  await user.type(screen.getByTestId(`${testId}-teamId`), "team1");
  await user.type(screen.getByTestId(`${testId}-tableOrBreakoutRoom`), "table");
  await user.type(
    screen.getByTestId(`${testId}-requestTime`),
    "2026-04-29T12:00",
  );
  await user.type(screen.getByTestId(`${testId}-explanation`), "Need help");
  await user.click(screen.getByTestId(`${testId}-solved`));

  await user.click(screen.getByTestId(`${testId}-submit`));

  expect(
    await screen.findByText("Max length 30 characters"),
  ).toBeInTheDocument();
}

/* Stryker disable BlockStatement */
test("requester email max length validation", async () => {
  await helpRequestFormRequesterEmailMaxLength();
  expect(screen.getByText("Max length 30 characters")).toBeInTheDocument();
});
/* Stryker restore BlockStatement */
