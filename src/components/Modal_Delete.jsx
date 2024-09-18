import './modal.scss';

export default function Modal_Delete({ close, isDelete, deleteJob }) {
  //#region State lấy danh sách và tìm id  công việc
  const listJob = JSON.parse(localStorage.getItem('jobs'));
  const findJob = listJob.find((job) => job.id === isDelete);
  //#endregion
  return (
    <>
      <div className="overlay">
        <div className="w-[600px] bg-white px-6 py-5 rounded flex flex-col  gap-4">
          <div className="flex justify-between items-center">
            <h3>Xác nhận</h3>
            <i
              className="fa-solid fa-close cursor-pointer p-2 rounded-full text-slate-900 text-[20px]"
              onClick={close}
            />
          </div>
          <div className="flex items-center">
            <i class="fa-solid fa-circle-exclamation mr-3 text-[#d74141] text-2xl"></i>
            Bạn có chắc chắn muốn xóa công việc " <b>{findJob?.name}</b> " không?
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={close} className="h-9 border px-4 btn-cancel rounded">
              Hủy
            </button>
            <button onClick={deleteJob} className="h-9 border px-4 btn-primary text-white rounded">
              Đồng ý
            </button>
          </div>
        </div>
      </div>
      ;
    </>
  );
}
