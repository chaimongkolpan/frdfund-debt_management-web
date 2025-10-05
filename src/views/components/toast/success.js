import toast from "react-hot-toast";
import { CheckCircle, X } from "react-feather";
const ToastContent = ({ t, title, message }) => {
  return (
    <div className="d-flex align-items-center">
      <div className="me-1"><CheckCircle size={12} color="success" /></div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h4 style={{ color: '#1c6c09' }}>{title}</h4>
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
export default ToastContent;
