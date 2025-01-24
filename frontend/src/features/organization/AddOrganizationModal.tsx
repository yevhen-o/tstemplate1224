import React, { useEffect, useState } from "react";
import { createSelector } from "reselect";

import { FieldType, useActions, useForm, useTypedSelector } from "src/hooks";
import Button from "src/components/Buttons";
import Modal from "src/components/Modal";
import { debounce } from "src/helpers/utils";

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
  const { isFetching, isFetched, hasError } = useTypedSelector((state) =>
    createSelector([(s) => s.todo, (_, key) => key], (todo, key) => todo[key])(
      state,
      "postItem"
    )
  );

  useEffect(() => {
    if (isFetched && !hasError) {
      onClose();
    }
  }, [isFetched, hasError, onClose]);

  const { getIsDomainAvailable, postNewOrganization } = useActions();

  const initialRules = {
    name: {
      isRequired: true,
      minLength: 3,
    },
    domain: {
      isRequired: true,
      isAlreadyExistsInArray: [""],
    },
  };

  const [rules, setRules] = useState(initialRules);

  const formFields: FieldType[] = [
    { fieldType: "input", name: "name", label: "Organization name" },
    { fieldType: "input", name: "domain", label: "Organization domain" },
  ];

  const {
    fields,
    values,
    resetForm,
    isFormValid,
    hasFormChanges,
    renderFormField,
    setFieldsTouched,
  } = useForm(rules, initialValue, formFields);

  useEffect(() => {
    const checkIsDomainAvailable = debounce(async (value: string) => {
      const res = (await getIsDomainAvailable({
        domain: value,
      })) as unknown as { payload: { available: boolean } };
      if (!res.payload.available) {
        setRules((prev) => ({
          ...prev,
          domain: {
            ...prev.domain,
            isAlreadyExistsInArray: [
              ...prev.domain.isAlreadyExistsInArray,
              value,
            ],
          },
        }));
      }
    }, 300);
    if (values.domain) checkIsDomainAvailable(values.domain);
  }, [values.domain, getIsDomainAvailable, setFieldsTouched]);

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
          {hasError && (
            <span className="text-red-500">Something goes wrong</span>
          )}
          {hasFormChanges() && <Button onClick={resetForm}>Reset</Button>}
          <Button isPrimary type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddOrganizationModal;
