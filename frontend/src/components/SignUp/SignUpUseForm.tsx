import Button from "../Buttons";
import Modal from "../Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import "./SignUpUseForm.scss";

const passwordLengthAndNoSpacesSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be at most 64 characters")
  .regex(/^\S*$/, "Password must not contain spaces");

const passwordUppercaseSchema = z
  .string()
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter");

const passwordDigitSchema = z
  .string()
  .regex(/\d/, "Password must contain at least one digit");

const schema = z
  .object({
    email: z.string().email(),
    first_name: z.string().min(3).max(255),
    password:
      passwordLengthAndNoSpacesSchema &&
      passwordUppercaseSchema &&
      passwordDigitSchema,
    confirm_password: z.string().min(8),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"],
  });

type FormValues = z.infer<typeof schema>;

type FormFieldsType = {
  name: keyof FormValues;
  placeholder?: string;
  type?: string;
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
    { name: "email", placeholder: "your_email@example.com" },
    { name: "password", type: "password", placeholder: "Strong password" },
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
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<FormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(schema),
    mode: "all",
  });

  const passwordValue = watch("password");

  const handleBlur = (field: keyof FormValues) => () =>
    setTouchedFields((prev) => ({ ...prev, [field]: true }));

  const getPasswordErrors = (name: keyof FormValues, value: string) => {
    const hasPasswordRequiredLength =
      passwordLengthAndNoSpacesSchema.safeParse(value);
    const hasPasswordLetters = passwordUppercaseSchema.safeParse(value);
    const hasPasswordDigits = passwordDigitSchema.safeParse(value);
    return (
      <>
        <span
          className={classNames({
            "field-help-text--error":
              touchedFields[name] && !hasPasswordRequiredLength.success,
            "field-help-text--success": hasPasswordRequiredLength.success,
          })}
        >
          <small>8 characters or more (no spaces)</small>
        </span>
        <span
          className={classNames({
            "field-help-text--error":
              touchedFields[name] && !hasPasswordLetters.success,
            "field-help-text--success": hasPasswordLetters.success,
          })}
        >
          <small>Uppercase and lowercase letters</small>
        </span>
        <span
          className={classNames({
            "field-help-text--error":
              touchedFields[name] && !hasPasswordDigits.success,
            "field-help-text--success": hasPasswordDigits.success,
          })}
        >
          <small>At least one digit</small>
        </span>
      </>
    );
  };

  return (
    <Modal title="Sign Up" onClose={onClose}>
      <form
        onSubmit={handleSubmit(submitFunction)}
        className="grid min-w-[18rem]"
      >
        {formFields.map(({ name, placeholder, ...rest }) => (
          <div
            onBlur={handleBlur(name)}
            className={classNames("field_wrapper", {
              "field_wrapper--error": errors[name] && touchedFields[name],
              "field_wrapper--success": !errors[name] && dirtyFields[name],
            })}
          >
            <input
              {...register(name)}
              placeholder={placeholder}
              name={name}
              autoComplete="new-password"
              {...rest}
            />
            {name !== "password" && errors[name] && touchedFields[name] && (
              <div className="text-red-500">
                <small>{errors[name].message}</small>
              </div>
            )}
            {name === "password" && getPasswordErrors(name, passwordValue)}
          </div>
        ))}

        <Button
          data-testId={"signUp"}
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
