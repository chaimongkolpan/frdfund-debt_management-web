import { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
const DropZone = (props) => {
  const { onChange, clearFile } = props;
  const [acceptedFiles, setFiles] = useState([]);
  const {getRootProps, getInputProps} = useDropzone({
    accept: {'Custom Files': ['.csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']},
    onDrop: files => {
      setFiles(files);
      onChange(files);
    },
    maxFiles: 1,
  });
  const RemoveFile = (index) => {
    acceptedFiles.splice(index, 1);
    setFiles(acceptedFiles);
    onChange(acceptedFiles);
  }
  const files = acceptedFiles.map((file, index) => (
      <div key={file.path} className="d-flex pb-3 border-bottom border-translucent media px-2">
        <div className="border p-2 rounded-2 me-2">
          <img className="rounded-2" width={25} src="/assets/img/icons/file.png" alt="..." data-dz-thumbnail="data-dz-thumbnail" />
        </div>
        <div className="flex-1 d-flex flex-between-center">
          <div>
            <h6 data-dz-name="data-dz-name">{file.path}</h6>
            <div className="d-flex align-items-center">
              <p className="mb-0 fs-9 text-body-quaternary lh-1" data-dz-size="data-dz-size">{file.size} bytes</p>
              <div className="dz-progress"><span className="dz-upload" data-dz-uploadprogress=""></span></div>
            </div>
          </div>
          <div className="dropdown">
            <button className="btn btn-link text-body-quaternary btn-sm dropdown-toggle btn-reveal dropdown-caret-none" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span className="fas fa-ellipsis-h"></span></button>
            <div className="dropdown-menu dropdown-menu-end border border-translucent py-2">
              <button className="dropdown-item" type="button" onClick={() => RemoveFile(index)}>Remove File</button>
            </div>
          </div>
        </div>
      </div>
  ));
  useEffect(() => {
    if (clearFile) {
      setFiles([]);
    }
  },[clearFile])
  return (
    <div className="p-0">
      <div {...getRootProps({className: 'dropzone', style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '50px',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out'
      }})}>
        <input {...getInputProps()} />
        <div><img className="me-2" src="/assets/img/icons/cloud-upload.svg" width="25" alt="" />Drop your file here</div>
      </div>
      <aside>
        <div className="m-0 d-flex flex-column pt-3">{files}</div>
      </aside>
      {/* <div className="dropzone dropzone-multiple p-0" data-dropzone="data-dropzone" data-options='{"url":"valid/url","maxFiles":1,"acceptedFiles":".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel","dictDefaultMessage":"Choose or Drop a file here"}'>
        <div className="fallback">
          <input ref={ref} type="file" name="file" onInput={handleChange} />
        </div>
        <div className="dz-message" data-dz-message="data-dz-message">
          <div className="dz-message-text"><img className="me-2" src="/assets/img/icons/cloud-upload.svg" width="25" alt="" />Drop your file here</div>
        </div>
        <div className="dz-preview dz-preview-multiple m-0 d-flex flex-column">
          <div className="d-flex pb-3 border-bottom border-translucent media px-2">
            <div className="border p-2 rounded-2 me-2"><img className="rounded-2 dz-image" src="/assets/img/icons/file.png" alt="..." data-dz-thumbnail="data-dz-thumbnail" /></div>
            <div className="flex-1 d-flex flex-between-center">
              <div>
                <h6 data-dz-name="data-dz-name"></h6>
                <div className="d-flex align-items-center">
                  <p className="mb-0 fs-9 text-body-quaternary lh-1" data-dz-size="data-dz-size"></p>
                  <div className="dz-progress"><span className="dz-upload" data-dz-uploadprogress=""></span></div>
                </div><span className="fs-10 text-danger" data-dz-errormessage="data-dz-errormessage"></span>
              </div>
              <div className="dropdown">
                <button className="btn btn-link text-body-quaternary btn-sm dropdown-toggle btn-reveal dropdown-caret-none" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span className="fas fa-ellipsis-h"></span></button>
                <div className="dropdown-menu dropdown-menu-end border border-translucent py-2"><a className="dropdown-item" href="#!" data-dz-remove="data-dz-remove">Remove File</a></div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
};
export default DropZone;