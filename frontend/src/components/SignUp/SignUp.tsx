import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import Modal from "../Modal";
import Button from "../Buttons";
import { useActions } from "src/hooks";
import { ResponseThunkAction } from "src/Types";
import { InputField } from "src/components/Forms/InputField";

const signUpSchema = z
  .object({
    firstName: z.string().max(250),
    lastName: z.string().max(250),
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must be at most 64 characters")
      .regex(/^\S*$/, "Password must not contain spaces")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
    confirmPassword: z.string(),
    age: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof signUpSchema>;

type FormFieldsType = {
  name: keyof FormValues;
  label?: string;
  type?: string;
};

const SignUp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const formFields: FormFieldsType[] = [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "email", label: "Email" },
    {
      type: "password",
      name: "password",
      label: "Password",
    },
    {
      type: "password",
      name: "confirmPassword",
      label: "Confirm Password",
    },
    {
      type: "number",
      name: "age",
      label: "Your age",
    },
  ];

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    age: "18",
  };

  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof FormValues, boolean>>
  >({});

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<FormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(signUpSchema),
    mode: "all",
  });

  const { signup } = useActions();

  const submitFunction: SubmitHandler<FormValues> = async (data) => {
    const re = (await signup({
      ...data,
      age: +data.age,
    })) as unknown as ResponseThunkAction;
    if (!re.error) {
      onClose();
    }
  };

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
              </>
            )}
          />
        ))}
        <Button
          isPrimary
          type="submit"
          className="mt-6"
          data-testid={"signUp"}
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
          Sing Up
        </Button>
      </form>
    </Modal>
  );
};

export default SignUp;
