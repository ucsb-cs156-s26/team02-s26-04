import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBOrganizationForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Organization Code",
    "Short Translation",
    "Full Translation",
    "Inactive",
  ];
  const testId = "UCSBOrganizationForm";

  const renderForm = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm {...props} />
        </Router>
      </QueryClientProvider>,
    );
  };

  test("renders correctly with no initialContents", async () => {
    renderForm();

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-orgCode`)).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-orgTranslationShort`),
    ).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-orgTranslation`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-inactive`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-cancel`)).toBeInTheDocument();
  });

  test("renders correctly when passing in initialContents", async () => {
    const initialContents = ucsbOrganizationFixtures.oneUcsbOrganization[0];

    renderForm({
      initialContents,
      buttonLabel: "Update",
    });

    expect(await screen.findByText(/Update/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-orgCode`)).toHaveValue(
      initialContents.orgCode,
    );
    expect(screen.getByTestId(`${testId}-orgCode`)).toBeDisabled();

    expect(screen.getByTestId(`${testId}-orgTranslationShort`)).toHaveValue(
      initialContents.orgTranslationShort,
    );
    expect(screen.getByTestId(`${testId}-orgTranslation`)).toHaveValue(
      initialContents.orgTranslation,
    );

    const inactiveCheckbox = screen.getByTestId(`${testId}-inactive`);
    expect(inactiveCheckbox).toHaveProperty(
      "checked",
      initialContents.inactive,
    );
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    renderForm();

    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    renderForm();

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByTestId(`${testId}-submit`);
    fireEvent.click(submitButton);

    await screen.findByText(/Organization Code is required/);
    expect(
      screen.getByText(/Short Translation is required/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Full Translation is required/),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId(`${testId}-orgCode`), {
      target: { value: "a".repeat(31) },
    });
    fireEvent.change(screen.getByTestId(`${testId}-orgTranslationShort`), {
      target: { value: "a".repeat(256) },
    });
    fireEvent.change(screen.getByTestId(`${testId}-orgTranslation`), {
      target: { value: "a".repeat(256) },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
      expect(screen.getAllByText(/Max length 255 characters/)).toHaveLength(2);
    });
  });

  test("submit button submits the correct data", async () => {
    const mockSubmitAction = vi.fn();

    renderForm({
      submitAction: mockSubmitAction,
    });

    fireEvent.change(screen.getByTestId(`${testId}-orgCode`), {
      target: { value: "ACM" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-orgTranslationShort`), {
      target: { value: "ACM" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-orgTranslation`), {
      target: { value: "Association for Computing Machinery" },
    });
    fireEvent.click(screen.getByTestId(`${testId}-inactive`));

    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(mockSubmitAction.mock.calls[0][0]).toEqual({
      orgCode: "ACM",
      orgTranslationShort: "ACM",
      orgTranslation: "Association for Computing Machinery",
      inactive: true,
    });
  });
});
