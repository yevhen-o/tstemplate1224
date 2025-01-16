import Button from "../Buttons";
import Modal from "../Modal";
import { useForm, FieldType, useActions } from "src/hooks";

const SignIn: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const formFields: FieldType[] = [
    { fieldType: "input", name: "email", label: "Email" },
    {
      fieldType: "input",
      type: "password",
      name: "password",
      label: "Password",
    },
  ];

  const RULES = {
    email: {
      isEmail: true,
      isRequired: true,
    },
    password: {
      isRequired: true,
    },
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const { fields, values, isFormValid, renderFormField, setFieldsTouched } =
    useForm(RULES, initialValues, formFields);

  const { login } = useActions();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid()) {
      await login(values);
      onClose();
    } else {
      setFieldsTouched();
    }
  };

  return (
    <Modal title="Sign in" onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid min-w-[14rem]">
        {fields.map(renderFormField)}
        <Button className="mt-4 " isPrimary type="submit">
          Sing In
        </Button>
      </form>
    </Modal>
  );
};

export default SignIn;
