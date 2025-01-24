import React, { useEffect } from "react";

import { FieldType, useActions, useForm, useTypedSelector } from "src/hooks";
import { debounce } from "src/helpers/utils";
import Button from "src/components/Buttons";
import Modal from "src/components/Modal";

type AddOrganizationModalProps = {
  onClose: () => void;
};

const AddOrganizationModal: React.FC<AddOrganizationModalProps> = ({
  onClose,
}) => {
  const initialValue = {
    name: "",
    domain: "",
  };

  // const { todoPostItem } = useActions();
  const { isFetching, error } = useTypedSelector(
    (store) => store.organization.postNewOrganization
  );

  const { getIsDomainAvailable, postNewOrganization } = useActions();

  const RULES = {
    name: {
      isRequired: true,
      minLength: 3,
    },
    domain: {
      isRequired: true,
      isAlreadyExistsInArray: [""],
    },
  };

  const formFields: FieldType[] = [
    { fieldType: "input", name: "name", label: "Organization name" },
    { fieldType: "input", name: "domain", label: "Organization domain" },
  ];

  const {
    fields,
    values,
    resetForm,
    isFormValid,
    setFormErrors,
    hasFormChanges,
    renderFormField,
    setFieldsTouched,
  } = useForm(RULES, initialValue, formFields);

  useEffect(() => {
    const checkIsDomainAvailable = debounce(async (value: string) => {
      const res = (await getIsDomainAvailable({
        domain: value,
      })) as unknown as { payload: { available: boolean } };
      if (!res.payload.available) {
        setFormErrors((prev) => ({
          ...prev,
          domain: "Sorry, this domain already in use",
        }));
      }
    }, 300);
    if (values.domain) checkIsDomainAvailable(values.domain);
  }, [values.domain, getIsDomainAvailable, setFormErrors]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid()) {
      const res = (await postNewOrganization(values)) as unknown as {
        error?: string;
      };
      if (!res.error) {
        onClose();
      }
    } else {
      setFieldsTouched();
    }
  };

  return (
    <Modal title="Add new organization" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
        <p className="mt-1 text-sm/6 text-gray-600">
          Use some descriptive name and use uniq domain, it will be a part of
          your privat urls
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {fields.map((field) => renderFormField(field))}
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          {isFetching && <span>Loading...</span>}
          {error && (
            <span className="text-red-500">
              {error.message || "Something goes wrong"}
            </span>
          )}
          {hasFormChanges() && <Button onClick={resetForm}>Reset</Button>}
          <Button disabled={isFetching} isPrimary type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddOrganizationModal;
