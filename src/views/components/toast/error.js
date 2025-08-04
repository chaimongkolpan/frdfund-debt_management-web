import toast from "react-hot-toast";
import { X } from "react-feather";
const ToastError = ({ t, title, message }) => {
  return (
    <div className="d-flex">
      <div className="me-1"><X size={12} color="danger" /></div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h4 style={{ color: '#fa3b1d' }}>{title ?? message}</h4>
          <X
            size={12}
            className="cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          />
        </div>
        <span style={{ fontSize: 18 }}>{message}</span>
      </div>
    </div>
  );
};
export default ToastError;
