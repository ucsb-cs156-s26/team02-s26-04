import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemCreatePage({
  storybook = false,
}) {
  const objectToAxiosParams = (UCSBDiningCommonsMenuItem) => ({
    url: "/api/ucsbdiningcommonsmenuitem/post",
    method: "POST",
    params: {
      name: UCSBDiningCommonsMenuItem.name,
      diningCommonsCode: UCSBDiningCommonsMenuItem.diningCommonsCode,
      station: UCSBDiningCommonsMenuItem.station,
    },
  });

  const onSuccess = (UCSBDiningCommonsMenuItem) => {
    toast(
      `New Dining Commons Menu Item Created - id: ${UCSBDiningCommonsMenuItem.id} name: ${UCSBDiningCommonsMenuItem.name}`,
    );
  };

  const mutation = useBackendMutation(objectToAxiosParams, { onSuccess }, [
    "/api/ucsbdiningcommonsmenuitem/all",
  ]);

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsbdiningcommonsmenuitem" />;
  }

export default function UCSBDiningCommonsMenuItemCreatePage() {
  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create page not yet implemented</h1>
      </div>
    </BasicLayout>
  );
}
