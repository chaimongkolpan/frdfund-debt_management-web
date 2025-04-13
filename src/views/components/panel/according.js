const According = (props) => {
  const { className, title, children } = props
  return (
    <div className={`card shadow-none border ${className ?? ''}`} data-component-card="data-component-card">
      <div className="card-header p-4 border-bottom bg-success-dark" >
        <div className="row g-3 justify-content-between align-items-center">
          <div className="col-12 col-md">
            <h4 className="text-secondary-subtle mb-0">{title}</h4>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="p-4 code-to-copy">{children}</div>
      </div>
    </div>
  );
};
export default According;