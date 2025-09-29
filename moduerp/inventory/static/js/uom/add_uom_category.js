const apiUrl = "/api/inventory/uom-categories/";
const uomCategoryNameInputElement = document.getElementById("uom-category-name-input");

async function createUomCategoryAPI(uomCategory) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken
      },
      credentials: "include",
      body: JSON.stringify(uomCategory)
    });
    

    if (!response.ok) {
      const errorData = await response.json();
      const messages = Object.entries(errorData)
        .map(([field, errors]) => errors.map(err => `${field}: ${err}`).join("<br>"))
        .join("<br>");
      throw new Error(messages);
    }

    // Show success toast
    showToast({
      title: "Success",
      message: `Units of Measure Category "${uomCategory.name}" created successfully`,
      type: "success",
      delay: 5000
    });

    // Reset page
    resetUomCategory();

  } catch (error) {
    // Show Error toast
    showToast({
      title: "Error",
      message: error.message || "Something went wrong while creating category",
      type: "danger",
      delay: 5000
    });
  }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

document.getElementById("save-btn").addEventListener("click", async () => {
  // Check if user enters uom category name
  const uomCategoryName = uomCategoryNameInputElement.value;
  if (!uomCategoryName) {
    uomCategoryNameInputElement.focus();
    return;
  }

  // Check if all field in uom table have been filled
  const rows = tableBody.querySelectorAll("tr");
  for (const row of rows) {
    const inputs = row.querySelectorAll("input[type='text'], input[type='number']");
    for (const input of inputs) {
      if (!input.value.trim()) {
        input.focus();
        return;
      }
    }
  }
  
  // Get uoms
  const uoms = [];
  rows.forEach(row => {
    const name = row.querySelector('input[name="uom-name-input"]').value.trim();
    const uom_type = row.querySelector('select[name="uom-type-select"]').value;
    const factor = parseFloat(row.querySelector('input[name="uom-ratio-input"]').value);
    const is_default = row.querySelector('input[name="uom-default-input"]').checked;

    uoms.push({
        name,
        uom_type,
        factor,
        is_default
    });
  });
  const uomCategory = {"name": uomCategoryName.trim(), "uoms": uoms};
  createUomCategoryAPI(uomCategory);
});