import { Button, Checkbox, Form, Input, Modal } from 'antd';
import './todoList.scss';
import { useEffect, useRef, useState } from 'react';
import Modal_Delete from './Modal_Delete';
import Modal_Edit from './Modal_Edit';

export default function TodoList() {
  //#region State khởi tạo dùng thêm, sửa, xóa công việc

  // Khởi tạo danh sách công việc từ localStorage (nếu có) hoặc mảng rỗng
  const [listJob, setListJob] = useState(() => {
    const jobLocal = JSON.parse(localStorage.getItem('jobs')) || [];
    return jobLocal;
  });

  // Khởi tạo tên công việc mới
  const [jobName, setJobName] = useState('');

  // Trạng thái lỗi cho công việc
  const [isError, setIsError] = useState('');
  const [isEditError, setIsEditError] = useState('');

  // Trạng thái hiển thị modal
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  //Tên và ID của công việc đang được chỉnh sửa
  const [editJobId, setEditJobId] = useState(null);
  const [editJobName, setEditJobName] = useState('');

  // ID của công việc đang được xác nhận xóa
  const [isDelete, setIsDelete] = useState(null);
  //#endregion

  // Tạo tham chiếu cho input
  const inputRef = useRef();

  /**
   * Sử dụng useEffect để tự động lấy tiêu điểm cho input khi component được gán vào DOM
   * Kiểm tra sữ tồn tại trước khi gọi focus
   * Auth: NTSon (19/09/2024)
   */
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  /**
   * Lấy giá trị từ ô input
   * @param {*} e Thông tin từ sự kiện
   * Auth: NTSon (18/09/2024)
   */
  const handleChange = (e) => {
    setJobName(e.target.value);
    setIsError('');
  };

  /**
   * Thêm mới công việc
   * @param {*} e  Ngăn chặn hành vi mặc định của sự kiện
   * @returns true Khi không có lỗi, False khi có lỗi
   * Auth: NTSon (18/09/2024)
   */
  const handleAddJob = (e) => {
    e.preventDefault();

    if (!jobName.trim()) {
      setIsError('Tên công việc không được để trống.');
      return;
    }

    const jobExists = listJob.some((job) => job.name === jobName.trim());
    if (jobExists) {
      setIsError('Tên công việc đã tồn tại.');
      return;
    }

    setIsError('');

    const jobInfo = {
      id: Math.ceil(Math.random() * 10000),
      name: jobName.trim(),
      status: false,
    };
    const newListJob = [...listJob, jobInfo];

    saveData('jobs', newListJob);
    setJobName('');
  };

  /**
   * Thay đổi trạng thái status
   * @param {*} id Tìm id cần thay đổi trạng thái
   * Tạo danh sách mới , kiểm tra id hiện tại có trùng với id truyền vào không, thay đổi
   * Auth: NTSon (18/09/2024)
   */
  const handleChecked = (id) => {
    const newListJob = listJob.map((job) => {
      if (job.id === id) {
        return { ...job, status: !job.status }; // Toggle trạng thái
      }
      return job;
    });

    localStorage.setItem('jobs', JSON.stringify(newListJob));
    setListJob(newListJob);
  };

  /**
   *Hiển thị modal xác nhận xóa công việc
   * @param {*} id  Tìm id của công việc cần xóa
   * Auth: NTSon (18/09/2024)
   */
  const handleShowConfirmDelete = (id) => {
    setIsDelete(id);
    setShowModal(true);
  };

  // Đóng modal xác nhận xóa công việc
  const handleCloseConfirmDelete = () => {
    setShowModal(false);
  };

  /**
   * Hàm xóa công việc khỏi danh sách
   * Auth: NTSon (18/09/2024)
   */
  const deleteJob = () => {
    const filterJob = listJob.filter((job) => job.id !== isDelete);
    saveData('jobs', filterJob);
    handleCloseConfirmDelete(); //Đóng modal xác nhận xóa
  };

  /**
   * Hiển thị modal để chỉnh sửa công việc
   * @param {*} id Tìm id của công việc cần sửa
   * Auth: NTSon (18/09/2024)
   */
  const handleShowEditJob = (id) => {
    const jobToEdit = listJob.find((job) => job.id === id);
    setEditJobId(id);
    setEditJobName(jobToEdit.name);
    setShowEditModal(true);
  };

  /**
   * Hàm xử lý chỉnh sửa công việc
   * @param {*} e - găn chặn hành vi mặc định của sự kiện
   * @returns true Khi không có lỗi, False khi có lỗi
   * Auth: NTSon (18/09/2024)
   */
  const handleEditJob = (e) => {
    e.preventDefault();

    // Kiểm tra tên công việc không để trống
    if (!editJobName.trim()) {
      setIsEditError('Tên công việc không được để trống.');
      return;
    }

    // Kiểm tra tên công việc có trùng lặp không
    const jobExists = listJob.some((job) => job.name === editJobName.trim() && job.id !== editJobId);
    if (jobExists) {
      setIsEditError('Tên công việc đã tồn tại.');
      return;
    }

    setIsEditError('');

    // Cập nhật công việc
    const updatedJobs = listJob.map((job) => {
      if (job.id === editJobId) {
        return { ...job, name: editJobName.trim() }; // Cập nhật tên công việc
      }
      return job;
    });

    saveData('jobs', updatedJobs);
    setEditJobId(null);
    setEditJobName('');
    setShowEditModal(false); // Đóng modal sau khi cập nhật
    setIsError(''); // Reset lỗi khi thành công
  };

  /**
   * Lưu dữ liệu vào localStorage và cập nhật danh sách công việc
   * @param {*} key - Khóa để lưu trữ dữ liệu trong localStorage
   * @param {*} array - Mảng dữ liệu cần lưu trữ
   * Auth: NTSon (18/09/2024)
   */
  function saveData(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
    setListJob(array);
  }

  return (
    <>
      {/* Hiển thị form Sửa công việc */}
      {showEditModal && (
        <Modal_Edit
          jobName={editJobName}
          setJobName={setEditJobName}
          onClick={handleEditJob}
          onCancel={() => setShowEditModal(false)}
          isError={isEditError}
        />
      )}

      {/* Hiển thị form xóa công việc */}
      {showModal && <Modal_Delete isDelete={isDelete} close={handleCloseConfirmDelete} deleteJob={deleteJob} />}

      <section className="flex justify-center items-center mt-[10%]">
        <div className="border rounded-md shadow-md py-5 px-20 min-w-[60%]">
          <header className="text-center font-semibold text-[30px] heading">Danh sách công việc</header>
          <Form className="flex gap-4 mb-6 relative" onClick={handleAddJob}>
            <div className="flex-1">
              <Input
                ref={inputRef}
                placeholder="Nhập tên công việc..."
                type="text"
                className="w-full border outline-none px-4 rounded h-10"
                onChange={handleChange}
                value={jobName}
              />
              {isError && <p className="error-description">{isError}</p>}
            </div>
            <Button type="submit" className="h-10 px-8 btn-primary rounded">
              Thêm
            </Button>
          </Form>
          <ul className="flex flex-col gap-3 mt-5 max-h-72 overflow-y-auto">
            {listJob.map((item) => (
              <li key={item.id} className="flex px-2 py-2 rounded justify-between items-center hover:bg-gray-200">
                <div className="flex gap-2 items-center">
                  <Checkbox
                    id={item.id}
                    checked={item.status}
                    className="h-4 w-4 cursor-pointer"
                    onChange={() => handleChecked(item.id)} // Sử dụng arrow function
                  />
                  <label htmlFor={item.id} className="cursor-pointer">
                    {item.status ? (
                      <s className="text-[15px] leading-loose">{item.name}</s>
                    ) : (
                      <span className="text-[15px] leading-loose">{item.name}</span>
                    )}
                  </label>
                </div>
                <div className="flex gap-4">
                  <i
                    className="fa-solid fa-pen cursor-pointer hover:bg-gray-300 p-2 rounded-full text-orange-300"
                    onClick={() => handleShowEditJob(item.id)}
                  />
                  <i
                    className="fa-solid fa-trash cursor-pointer hover:bg-gray-300 p-2 rounded-full text-red-600"
                    onClick={() => handleShowConfirmDelete(item.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
          <footer>
            {/* Kiểm tra dữ liệu công việc để hiển thị */}
            {listJob.length > 0 ? (
              listJob.every((job) => job.status) ? (
                <div className="flex items-center justify-center mt-3 bg-gray-100 p-2 rounded">
                  <i className="fa-solid fa-circle-check mr-3 text-[#50B83C] text-2xl" />
                  Hoàn thành công việc
                </div>
              ) : (
                <div className="mt-3 bg-gray-100 p-2 rounded">
                  Công việc đã hoàn thành: <b>{listJob.filter((job) => job.status).length}</b> / <b>{listJob.length}</b>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center">
                <img src="./note.jpg" alt="Không có công việc" className="w-[200px] h-[200px] rounded-md" />
              </div>
            )}
          </footer>
        </div>
      </section>
    </>
  );
}
