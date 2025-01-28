import Button from "../Buttons";
import Modal from "../Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { signUpSchema } from "./PasswordValidationSchemas";

import "./SignUpUseForm.scss";
import { InputField } from "../Forms/InputField/InputField";
import PasswordValidationHelper from "./PasswordValidationHelper";

type FormValues = z.infer<typeof signUpSchema>;

type FormFieldsType = {
  name: keyof FormValues;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
};

const SignUp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const initialValues = {
    first_name: "",
    email: "",
    password: "",
    confirm_password: "",
  };

  const formFields: FormFieldsType[] = [
    { name: "first_name", placeholder: "Your name" },
    {
      name: "email",
      placeholder: "your_email@example.com",
      autoComplete: "new-password",
    },
    {
      name: "password",
      type: "password",
      placeholder: "Strong password",
      autoComplete: "new-password",
    },
    {
      name: "confirm_password",
      type: "password",
      placeholder: "Repeat your password",
    },
  ];

  const submitFunction: SubmitHandler<FormValues> = async (data) => {
    console.log("Submitting form with data", data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
        onClose();
      }, 15 * 1000);
    });
  };

  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof FormValues, boolean>>
  >({});

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<FormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(signUpSchema),
    mode: "all",
  });

  const passwordValue = watch("password");

  const handleBlur = (field: keyof FormValues) =>
    setTouchedFields((prev) => ({ ...prev, [field]: true }));

  return (
    <Modal title="Sign Up" onClose={onClose}>
      <form
        onSubmit={handleSubmit(submitFunction)}
        className="grid min-w-[18rem]"
      >
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
                {name === "password" && (
                  <PasswordValidationHelper
                    isTouched={touchedFields[name]}
                    value={passwordValue}
                  />
                )}
              </>
            )}
          />
        ))}

        <Button
          data-testid={"signUp"}
          className="mt-4 "
          isPrimary
          type="submit"
          disabled={isSubmitting}
          onClick={() =>
            setTouchedFields(
              formFields.reduce(
                (acc, field) => ({ ...acc, [field.name]: true }),
                {}
              )
            )
          }
        >
          {isSubmitting ? "Submitting" : "Sing Up"}
        </Button>
      </form>
    </Modal>
  );
};

export default SignUp;
