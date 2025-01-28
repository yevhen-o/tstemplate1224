import { z } from "zod";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import Modal from "src/components/Modal";
import Button from "src/components/Buttons";
import { debounce } from "src/helpers/utils";
import { ResponseThunkAction } from "src/Types";
import { useTypedSelector, useActions } from "src/hooks";
import { InputField } from "src/components/Forms/InputField";

const addOrganizationSchema = z.object({
  name: z.string().max(250),
  domain: z.string().regex(/^\S*$/, "Domain must not contain spaces").max(64),
});

type FormValues = z.infer<typeof addOrganizationSchema>;

type FormFieldsType = {
  name: keyof FormValues;
  label?: string;
  type?: string;
};

type AddOrganizationModalProps = {
  onClose: () => void;
};

const AddOrganizationModal: React.FC<AddOrganizationModalProps> = ({
  onClose,
}) => {
  const initialValues = {
    name: "",
    domain: "",
  };

  const { isFetching, error } = useTypedSelector(
    (store) => store.organization.postNewOrganization
  );

  const { getIsDomainAvailable, postNewOrganization } = useActions();

  const formFields: FormFieldsType[] = [
    { name: "name", label: "Organization name" },
    { name: "domain", label: "Organization domain" },
  ];

  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof FormValues, boolean>>
  >({});

  const {
    watch,
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields, isDirty },
  } = useForm<FormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(addOrganizationSchema),
    mode: "all",
  });

  const domainValue = watch("domain");

  useEffect(() => {
    const checkIsDomainAvailable = debounce(async (value: string) => {
      const res = (await getIsDomainAvailable({
        domain: value,
      })) as unknown as ResponseThunkAction & {
        payload: { available: boolean };
      };
      if (!res.payload.available) {
        setError("domain", {
          type: "custom",
          message: "Sorry, this domain already in use",
        });
      }
    }, 300);
    if (domainValue) checkIsDomainAvailable(domainValue);
  }, [domainValue, getIsDomainAvailable, setError]);

  const submitFunction: SubmitHandler<FormValues> = async (data) => {
    const res = (await postNewOrganization(
      data
    )) as unknown as ResponseThunkAction;
    if (!res.error) {
      onClose();
    }
  };

  const handleBlur = (field: keyof FormValues) =>
    setTouchedFields((prev) => ({ ...prev, [field]: true }));

  return (
    <Modal title="Add new organization" onClose={onClose}>
      <form onSubmit={handleSubmit(submitFunction)} style={{ padding: "20px" }}>
        <p className="mt-1 text-sm/6 text-gray-600">
          Use some descriptive name and use uniq domain, it will be a part of
          your privat urls
        </p>
        <div className="mt-10 flex flex-col gap-8">
          {formFields.map(({ name, ...rest }) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field: { onBlur, ...restFieldsProps } }) => (
                <>
                  <InputField
                    {...rest}
                    {...restFieldsProps}
                    onBlur={() => {
                      onBlur();
                      handleBlur(name);
                    }}
                    errorMessage={errors[name]?.message}
                    isTouched={touchedFields[name]}
                    isDirty={dirtyFields[name]}
                  />
                </>
              )}
            />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          {isFetching && <span>Loading...</span>}
          {error && (
            <span className="text-red-500">
              {error.message || "Something goes wrong"}
            </span>
          )}
          {isDirty && <Button onClick={() => reset()}>Reset</Button>}
          <Button
            disabled={isFetching || isSubmitting}
            isPrimary
            type="submit"
            onClick={() =>
              setTouchedFields(
                formFields.reduce(
                  (acc, field) => ({ ...acc, [field.name]: true }),
                  {}
                )
              )
            }
          >
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddOrganizationModal;
