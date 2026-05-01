import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import HelpRequestForm from "main/components/HelpRequests/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("HelpRequestForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Requester Email",
    "Team Id",
    "Table or Breakout Room",
    "Request Time (iso format)",
    "Explanation",
    "Solved",
  ];
  const testId = "HelpRequestForm";

  const fieldTestIdSuffixes = [
    "requesterEmail",
    "teamId",
    "tableOrBreakoutRoom",
    "requestTime",
    "explanation",
    "solved",
    "submit",
    "cancel",
  ];

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    fieldTestIdSuffixes.forEach((suffix) => {
      expect(screen.getByTestId(`${testId}-${suffix}`)).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
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

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();

    fieldTestIdSuffixes.forEach((suffix) => {
      expect(screen.getByTestId(`${testId}-${suffix}`)).toBeInTheDocument();
    });

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
    expect(screen.getByTestId(`${testId}-requestTime`).value).not.toContain(
      "Z",
    );
    expect(screen.getByTestId(`${testId}-explanation`)).toHaveValue(
      initialContents.explanation,
    );
    expect(screen.getByTestId(`${testId}-solved`)).not.toBeChecked();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
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

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
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
    expect(screen.getByText(/Solved is required/)).toBeInTheDocument();
  });

  test("requester email max length validation", async () => {
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

    fireEvent.change(screen.getByTestId(`${testId}-requesterEmail`), {
      target: { value: "a".repeat(31) },
    });
    fireEvent.change(screen.getByTestId(`${testId}-teamId`), {
      target: { value: "team1" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-tableOrBreakoutRoom`), {
      target: { value: "table" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-requestTime`), {
      target: { value: "2026-04-29T12:00" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-explanation`), {
      target: { value: "Need help" },
    });
    fireEvent.click(screen.getByTestId(`${testId}-solved`));

    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    expect(
      await screen.findByText("Max length 30 characters"),
    ).toBeInTheDocument();
  });
});
