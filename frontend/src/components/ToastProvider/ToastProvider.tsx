import { useToastsToDisplay } from "src/store/toasts/toastsStore";
import Toast from "./Toast";
import "./Toast.scss";

const ToastProvider: React.FC = () => {
  const toastsToDisplay = useToastsToDisplay();

  return (
    <div className={"toasts"}>
      {toastsToDisplay &&
        toastsToDisplay.map((toast) => (
          <div key={toast.id} className={"toasts-container"}>
            <Toast toast={toast} />
          </div>
        ))}
    </div>
  );
};

export default ToastProvider;
