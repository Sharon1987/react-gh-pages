import * as bootstrap from "bootstrap";

function DeleteProductModal({
  DeleteProductModal,
  tempProduct,
  handleConfirmDelete
}) {
return (
 <div
  className="modal fade"
  id="delProductModal"
  tabIndex="-1"
  aria-labelledby="delProductModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog">
    <div className="modal-content border-0">
      <div className="modal-header bg-danger text-white">
        <h5 className="modal-title" id="delProductModalLabel">
          <span>刪除產品</span>
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body">
        是否刪除
        <strong className="text-danger"> {tempProduct.title} </strong>
        (刪除後無法恢復)。
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-outline-secondary"
          data-bs-dismiss="modal"
        >
          取消
        </button>
        <button 
          type="button" 
          className="btn btn-danger"
          onClick={handleConfirmDelete}
        >
          確認刪除
        </button>
      </div>
    </div>
  </div>
</div>
);
}

export default DeleteProductModal;