import './modal.scss';

export default function Modal_Edit({ jobName, setJobName, onClick, onCancel, isError }) {
  return (
    <>
      <div className="overlay">
        <div className="w-[450px] bg-white px-6 py-5 rounded flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[18px] font-semibold">Cập nhật công việc</h3>
            <i
              className="fa-solid fa-close cursor-pointer p-2 rounded-full text-slate-900 text-[20px]"
              onClick={onCancel}
            />
          </div>
          <div className="flex flex-col gap-2 mb-4 relative">
            <label className="text-start font-semibold" htmlFor="jobName">
              Tên công việc
            </label>
            <input
              id="jobName"
              type="text"
              className="rounded h-9 border px-4 outline-none hover:shadow-md shadow focus:border-[#004999]"
              value={jobName} // Sử dụng value để hiển thị tên công việc
              onChange={(e) => setJobName(e.target.value)} // Cập nhật tên công việc
            />
            {isError && <p className="error-description">{isError}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button className="h-9 border px-4 btn-cancel rounded" onClick={onCancel}>
              Hủy
            </button>
            <button className="h-9 border px-4 btn-primary rounded" onClick={onClick}>
              Lưu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
