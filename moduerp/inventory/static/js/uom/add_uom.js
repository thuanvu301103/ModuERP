const tableBody = document.querySelector("#uom-table tbody");
const addBtn = document.getElementById("add-uom-btn");

addBtn.addEventListener("click", () => {
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td class="text-start p-1">
            <input type="text" 
                class="form-control form-control-sm bg-dark text-white fw-light placeholder-blue-grey-5 border-0" 
                placeholder="Unit of Measure">
        </td>
        <td class="text-start p-1">
            <input type="text" 
                class="form-control form-control-sm bg-dark text-white fw-light placeholder-blue-grey-5 border-0" 
                placeholder="Type">
        </td>
        <td class="text-end p-1">
            <input type="number" 
                class="form-control form-control-sm bg-dark text-white fw-light placeholder-blue-grey-5 border-0 
                placeholder="Ratio">
        </td>
        <td class="text-center px-3"><input type="checkbox" class="form-check-input"></td>
        <td class="text-center px-3">
        <button type="button" class="btn btn-danger btn-sm remove-btn">Remove</button>
      </td>
    `;

    tableBody.appendChild(newRow);

    // Add event listener cho nút remove
    newRow.querySelector(".remove-btn").addEventListener("click", () => {
      newRow.remove();
    });
});