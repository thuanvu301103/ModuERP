import { getIdFromUrl } from '../utils/get_id_from_url.js';
import { deleteUomCategory } from '../api/delete_uom_category.js';
import { showToast } from '../../components/toast.js';

document.addEventListener("DOMContentLoaded", async () => {
  const categoryId = getIdFromUrl();
  const deleteBtn = document.getElementById("delete-btn");
  deleteBtn.addEventListener("click", async () => {
    try {
      const response = await deleteUomCategory(categoryId);
      console.log("Response Ok? ", response.ok);
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      showToast({
        title: "Success",
        message: `Units of Measure Category deleted successfully`,
        type: "success",
        delay: 1500
      });
      setTimeout(() => {
        window.location.href = "/inventory/uom-categories/";
      }, 2000);
    } catch (error) {
      showToast({
        title: "Error",
        message: error || "Something went wrong while creating category",
        type: "danger",
        delay: 5000
      });
  }});
});