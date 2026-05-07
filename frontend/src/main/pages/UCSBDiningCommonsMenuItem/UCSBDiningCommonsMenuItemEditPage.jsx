import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemEditPage({
  storybook = false,
}) {
  let { id } = useParams();

  const {
    data: UCSBDiningCommonsMenuItem,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/ucsbdiningcommonsmenuitem?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/ucsbdiningcommonsmenuitem`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (menuItem) => ({
    url: "/api/ucsbdiningcommonsmenuitem",
    method: "PUT",
    params: {
      id: menuItem.id,
    },
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
    // Stryker disable next-line all : hard to set up test for caching
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
            buttonLabel={"Update"}
            initialContents={UCSBDiningCommonsMenuItem}
          />
        )}
      </div>
    </BasicLayout>
  );
}
