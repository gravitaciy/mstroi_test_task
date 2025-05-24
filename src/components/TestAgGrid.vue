<script>
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-theme-alpine.css'

export default {
  components: { AgGridVue },
  data() {
    return {
      rowData: [
        { id: 1, name: 'Test' },
        { id: 2, name: 'Demo' }
      ],
      columnDefs: [
        { headerName: 'ID', field: 'id' },
        { headerName: 'Name', field: 'name' }
      ]
    }
  }
}
</script>

<template>
  <div>
    <h3>Минимальный AG Grid (отдельный компонент):</h3>
    <div class="ag-theme-alpine" style="height: 300px; width: 400px;">
      <AgGridVue :rowData="rowData" :columnDefs="columnDefs" />
    </div>
  </div>
</template> 