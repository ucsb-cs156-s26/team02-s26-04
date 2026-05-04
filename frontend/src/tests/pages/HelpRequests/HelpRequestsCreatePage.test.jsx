import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestsCreatePage from "main/pages/HelpRequests/HelpRequestsCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = vi.fn();
/* Stryker disable all */
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});
/* Stryker restore all */

const axiosMock = new AxiosMockAdapter(axios);

beforeEach(() => {
  vi.clearAllMocks();
  axiosMock.reset();
  axiosMock.resetHistory();
  axiosMock
    .onGet("/api/currentUser")
    .reply(200, apiCurrentUserFixtures.userOnly);
  axiosMock
    .onGet("/api/systemInfo")
    .reply(200, systemInfoFixtures.showingNeither);
});

const queryClient = new QueryClient();

async function helpRequestsCreatePageRenders() {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <HelpRequestsCreatePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );

  await screen.findByLabelText("Requester Email");
  await screen.findByText("Welcome, pconrad.cis@gmail.com");
  const footerSource = screen
    .getByTestId("footer-see-source-code")
    .querySelector("a");
  expect(footerSource).toHaveAttribute(
    "href",
    systemInfoFixtures.showingNeither.sourceRepo,
  );
}

/* Stryker disable BlockStatement */
test(helpRequestsCreatePageRenders.name, async () => {
  await helpRequestsCreatePageRenders();
  expect(screen.getByRole("heading")).toHaveTextContent(
    "Create New Help Request",
  );
});
/* Stryker restore BlockStatement */

async function helpRequestsCreatePageSubmitPostsAndRedirects() {
  const qClient = new QueryClient();
  const helpRequest = {
    id: 3,
    requesterEmail: "john.doe@ucsb.edu",
    teamId: 1,
    tableOrBreakoutRoom: "Table 5",
    requestTime: "2023-10-10T10:00",
    explanation: "I need help with my homework",
    solved: false,
  };

  axiosMock.onPost("/api/helprequests/post").reply(202, helpRequest);

  render(
    <QueryClientProvider client={qClient}>
      <MemoryRouter>
        <HelpRequestsCreatePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );

  await screen.findByLabelText("Requester Email");
  await screen.findByText("Welcome, pconrad.cis@gmail.com");
  const footerSource = screen
    .getByTestId("footer-see-source-code")
    .querySelector("a");
  expect(footerSource).toHaveAttribute(
    "href",
    systemInfoFixtures.showingNeither.sourceRepo,
  );

  const requesterEmailInput = screen.getByLabelText("Requester Email");
  expect(requesterEmailInput).toBeInTheDocument();

  const teamIdInput = screen.getByLabelText("Team Id");
  expect(teamIdInput).toBeInTheDocument();

  const tableOrBreakoutRoomInput = screen.getByLabelText(
    "Table or Breakout Room",
  );
  expect(tableOrBreakoutRoomInput).toBeInTheDocument();

  const requestTimeInput = screen.getByLabelText("Request Time (iso format)");
  expect(requestTimeInput).toBeInTheDocument();

  const explanationInput = screen.getByLabelText("Explanation");
  expect(explanationInput).toBeInTheDocument();

  const solvedInput = screen.getByLabelText("Solved");
  expect(solvedInput).toBeInTheDocument();

  const createButton = screen.getByText("Create");
  expect(createButton).toBeInTheDocument();

  fireEvent.change(requesterEmailInput, {
    target: { value: "john.doe@ucsb.edu" },
  });
  fireEvent.change(teamIdInput, { target: { value: 1 } });
  fireEvent.change(tableOrBreakoutRoomInput, {
    target: { value: "Table 5" },
  });
  fireEvent.change(requestTimeInput, {
    target: { value: "2023-10-10T10:00" },
  });
  fireEvent.change(explanationInput, {
    target: { value: "I need help with my homework" },
  });

  fireEvent.click(createButton);

  await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

  expect(axiosMock.history.post[0].params).toEqual({
    requesterEmail: "john.doe@ucsb.edu",
    teamId: "1",
    tableOrBreakoutRoom: "Table 5",
    requestTime: "2023-10-10T10:00",
    explanation: "I need help with my homework",
    solved: false,
  });

  expect(mockToast).toBeCalledWith(
    "New help request Created - id: 3 requesterEmail: john.doe@ucsb.edu teamId: 1 tableOrBreakoutRoom: Table 5 requestTime: 2023-10-10T10:00 explanation: I need help with my homework solved: false",
  );
  expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });
}

/* Stryker disable BlockStatement */
test("on submit, makes request to backend, and redirects to /helprequests", async () => {
  await helpRequestsCreatePageSubmitPostsAndRedirects();
  expect(mockNavigate).toHaveBeenCalledTimes(1);
});
/* Stryker restore BlockStatement */
