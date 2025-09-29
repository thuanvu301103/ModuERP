function resetUomCategory() {
  const uomCategoryNameInputElement = document.getElementById("uom-category-name-input");
  uomCategoryNameInputElement.value = "";

  const tableBody = document.querySelector("#uom-table tbody");
  tableBody.innerHTML = `
    <!-- Reference UoM -->
    <tr class="border-bottom border-bottom-1 border-blue-grey-5">
      <td class="text-start p-1">
        <input type="text" name="uom-name-input"
          class="form-control form-control-sm bg-dark text-white fw-light placeholder-blue-grey-5 border-0" 
          placeholder="Unit of Measure">
      </td>
      <td class="text-start p-1">
        <select name="uom-type-select" class="form-select form-select-sm bg-dark text-white border-0" disabled>
          <option value="reference" selected>Reference Unit</option>
          <option value="bigger">Bigger than Reference</option>
          <option value="smaller">Smaller than Reference</option>
        </select>
      </td>
      <td class="text-end p-1">
        <input type="number" name="uom-ratio-input"
          class="form-control form-control-sm bg-dark text-white placeholder-blue-grey-5 border-0"
          placeholder="Ratio" style="text-align: right;" value="1.0" readonly>
      </td>
      <td class="text-center p-1"><input name="uom-default-input" type="checkbox" class="form-check-input bg-dark" checked></td>
      <td class="text-center p-1"></td>
    </tr>
  `
}
