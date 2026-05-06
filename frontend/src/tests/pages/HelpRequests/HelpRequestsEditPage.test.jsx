import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import HelpRequestsEditPage from "main/pages/HelpRequests/HelpRequestsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

const mockToast = vi.fn();
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
    useParams: vi.fn(() => ({
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("HelpRequestsEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Help Request");
      expect(
        screen.queryByTestId("HelpRequest-requesterEmail"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "erik_rodriguez@ucsb.edu",
        teamId: "team1",
        tableOrBreakoutRoom: "table1",
        requestTime: "2026-04-29T12:00:00",
        explanation: "Need help",
        solved: false,
      });
      axiosMock.onPut("/api/helprequests").reply(200, {
        id: "17",
        requesterEmail: "erik_rodriguez@ucsb.edu",
        teamId: "team1",
        tableOrBreakoutRoom: "table1",
        requestTime: "2026-04-29T12:00:00",
        explanation: "Need help",
        solved: false,
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestForm-requesterEmail",
      );
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableOrBreakoutRoomField = screen.getByTestId(
        "HelpRequestForm-tableOrBreakoutRoom",
      );
      const requestTimeField = screen.getByTestId(
        "HelpRequestForm-requestTime",
      );
      const explanationField = screen.getByTestId(
        "HelpRequestForm-explanation",
      );
      const solvedField = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("erik_rodriguez@ucsb.edu");
      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue("team1");
      expect(tableOrBreakoutRoomField).toBeInTheDocument();
      expect(tableOrBreakoutRoomField).toHaveValue("table1");
      expect(requestTimeField).toBeInTheDocument();
      expect(requestTimeField).toHaveValue("2026-04-29T12:00");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("Need help");
      expect(solvedField).toBeInTheDocument();
      expect(solvedField).not.toBeChecked();

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "erik_rodriguez@ucsb.edu" },
      });
      fireEvent.change(teamIdField, {
        target: { value: "team1" },
      });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "table1" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2026-04-29T12:00" },
      });
      fireEvent.change(explanationField, {
        target: { value: "Need help" },
      });
      fireEvent.click(solvedField);
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Help Request Updated - id: 17 requesterEmail: erik_rodriguez@ucsb.edu teamId: team1 tableOrBreakoutRoom: table1 requestTime: 2026-04-29T12:00:00 explanation: Need help solved: false",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "erik_rodriguez@ucsb.edu",
          teamId: "team1",
          tableOrBreakoutRoom: "table1",
          requestTime: "2026-04-29T12:00",
          explanation: "Need help",
          solved: true,
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestForm-requesterEmail",
      );
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableOrBreakoutRoomField = screen.getByTestId(
        "HelpRequestForm-tableOrBreakoutRoom",
      );
      const requestTimeField = screen.getByTestId(
        "HelpRequestForm-requestTime",
      );
      const explanationField = screen.getByTestId(
        "HelpRequestForm-explanation",
      );
      const solvedField = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("erik_rodriguez@ucsb.edu");
      expect(teamIdField).toHaveValue("team1");
      expect(tableOrBreakoutRoomField).toHaveValue("table1");
      expect(requestTimeField).toHaveValue("2026-04-29T12:00");
      expect(explanationField).toHaveValue("Need help");
      expect(solvedField).not.toBeChecked();
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(requesterEmailField, {
        target: { value: "erik_rodriguez@ucsb.edu" },
      });
      fireEvent.change(teamIdField, {
        target: { value: "team1" },
      });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "table1" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2026-04-29T12:00" },
      });
      fireEvent.change(explanationField, {
        target: { value: "Need help" },
      });
      fireEvent.click(solvedField);
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Help Request Updated - id: 17 requesterEmail: erik_rodriguez@ucsb.edu teamId: team1 tableOrBreakoutRoom: table1 requestTime: 2026-04-29T12:00:00 explanation: Need help solved: false",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });
    });
  });
});
