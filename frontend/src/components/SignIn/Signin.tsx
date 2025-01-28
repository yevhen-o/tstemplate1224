import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import Modal from "../Modal";
import Button from "../Buttons";
import { useActions } from "src/hooks";
import { ResponseThunkAction } from "src/Types";
import InputField from "src/components/Forms/InputField";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type FormValues = z.infer<typeof signInSchema>;

type FormFieldsType = {
  name: keyof FormValues;
  label?: string;
  type?: string;
};

const SignIn: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const formFields: FormFieldsType[] = [
    { name: "email", label: "Email" },
    {
      type: "password",
      name: "password",
      label: "Password",
    },
  ];

  const initialValues = {
    email: "",
    password: "",
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
    resolver: zodResolver(signInSchema),
    mode: "all",
  });

  const { login } = useActions();

  const submitFunction: SubmitHandler<FormValues> = async (data) => {
    const re = (await login(data)) as unknown as ResponseThunkAction;
    if (!re.error) {
      onClose();
    }
  };

  const handleBlur = (field: keyof FormValues) =>
    setTouchedFields((prev) => ({ ...prev, [field]: true }));

  return (
    <Modal title="Sign in" onClose={onClose}>
      <form
        onSubmit={handleSubmit(submitFunction)}
        className="grid min-w-[14rem]"
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
          data-testid={"signIn"}
          disabled={isSubmitting}
        >
          Sing In
        </Button>
      </form>
    </Modal>
  );
};

export default SignIn;
