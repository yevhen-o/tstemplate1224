import Button from "../Buttons";
import Modal from "../Modal";
import { useForm, FieldType, useActions } from "src/hooks";

const SignUp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const formFields: FieldType[] = [
    { fieldType: "input", name: "firstName", label: "First Name" },
    { fieldType: "input", name: "lastName", label: "Last Name" },
    { fieldType: "input", name: "email", label: "Email" },
    {
      fieldType: "input",
      type: "password",
      name: "password",
      label: "Password",
    },
    {
      fieldType: "input",
      type: "password",
      name: "confirmPassword",
      label: "Confirm Password",
    },
    {
      fieldType: "input",
      type: "number",
      name: "age",
      label: "Your age",
    },
  ];

  const RULES = {
    firstName: {
      isRequired: true,
      maxLength: 250,
    },
    lastName: {
      maxLength: 250,
    },
    email: {
      isEmail: true,
      isRequired: true,
    },
    password: {
      isRequired: true,
    },
    confirmPassword: {
      isRequired: true,
      customRules: [
        (value: string, values: Record<string, string>) => {
          if (value !== values?.password) {
            return {
              isValid: false,
              errorMessage: "This field should match password field",
            };
          } else {
            return {
              isValid: true,
              errorMessage: null,
            };
          }
        },
      ],
    },
  };

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    age: 18,
  };

  const { fields, values, isFormValid, renderFormField, setFieldsTouched } =
    useForm(RULES, initialValues, formFields);

  const { signup } = useActions();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid()) {
      await signup(values);
      onClose();
    } else {
      setFieldsTouched();
    }
  };

  return (
    <Modal title="Sign Up" onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid min-w-[18rem]">
        {fields.map(renderFormField)}
        <Button
          data-testId={"signUp"}
          className="mt-4 "
          isPrimary
          type="submit"
        >
          Sing Up
        </Button>
      </form>
    </Modal>
  );
};

export default SignUp;
