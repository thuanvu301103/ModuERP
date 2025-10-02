import { postUomCategory } from "../api/post_uom_category.js";
import { showToast } from '../../components/toast.js'
import { registerUomCategoryNewToolbarEvent } from '../components/uom_category_new_toolbar.js';
import { getUomCategoryNewFormValue, resetUomCategoryNewFormValue } from '../components/uom_category_new_form.js';

async function send() {
    try {
        const data = await getUomCategoryNewFormValue("data");
        if (!data) return;
        const response = await postUomCategory(data);
        if (!response.ok) {
          const error = await response.json();
          throw error;
        }
        showToast({
          title: "Success",
          message: `Units of Measure Category "${data.name}" created successfully`,
          type: "success",
          delay: 5000
        });
        await resetUomCategoryNewFormValue();
    } catch (error) {
      console.log(error);
        showToast({
          title: "Error",
          message: error || "Something went wrong while creating category",
          type: "danger",
          delay: 5000
        });
    }
}

async function registerEvent() {
  await registerUomCategoryNewToolbarEvent("save", async () => {
    await send();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await registerEvent();
});