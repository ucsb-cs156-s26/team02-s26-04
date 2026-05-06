import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams, Navigate } from "react-router";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemEditPage({
  storybook = false,
}) {
  let { id } = useParams();

  const {
    data: UCSBDiningCommonsMenuItem,
  } = useBackend(
    [`/api/ucsbdiningcommonsmenuitem?id=${id}`],
    {
      method: "GET",
      url: `/api/ucsbdiningcommonsmenuitem`,
      params: { id },
    },
  );

  const objectToAxiosPutParams = (menuItem) => ({
    url: "/api/ucsbdiningcommonsmenuitem",
    method: "PUT",
    params: { id: menuItem.id },
    data: {
      name: menuItem.name,
      station: menuItem.station,
      diningCommonsCode: menuItem.diningCommonsCode,
    },
  });

  const onSuccess = (menuItem) => {
    toast(
      `UCSBDiningCommonsMenuItem Updated - id: ${menuItem.id} name: ${menuItem.name}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    [`/api/ucsbdiningcommonsmenuitem?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsbdiningcommonsmenuitem" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSBDiningCommonsMenuItem</h1>

        {UCSBDiningCommonsMenuItem && (
          <UCSBDiningCommonsMenuItemForm
            submitAction={onSubmit}
            buttonLabel="Update"
            initialContents={UCSBDiningCommonsMenuItem}
          />
        )}
      </div>
    </BasicLayout>
  );
}