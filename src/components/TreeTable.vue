<script setup>
import { ref, computed, provide, watch } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
// Удалил импорты AG Grid CSS, так как переходим на новую систему темизации
// import 'ag-grid-community/styles/ag-grid.css'
// import 'ag-grid-community/styles/ag-theme-alpine.css'
import TreeTable from '../utils/TreeTable.js'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
ModuleRegistry.registerModules([AllCommunityModule])

// Пример начальных данных
const initialItems = [
  { id: 1, parent: null, label: 'Дело 1' },
  { id: 2, parent: 1, label: 'Дело 1.1' },
  { id: 3, parent: 1, label: 'Дело 1.2' },
  { id: 4, parent: null, label: 'Дело 2' },
  { id: 5, parent: 4, label: 'Дело 2.1' },
  { id: 6, parent: 4, label: 'Дело 2.2' },
]

const mode = ref('view') // 'view' | 'edit'
const treeTable = ref(new TreeTable(initialItems))
const editing = ref({}) // id: label
const dragId = ref(null)
const gridApi = ref(null)

// Для Community-версии делаем плоский список без treeData
const rowData = ref(treeTable.value.getList())
watch(
  () => treeTable.value.getList(),
  (val) => { rowData.value = val },
  { deep: true }
)

function setMode(m) {
  mode.value = m
  if (m === 'view') editing.value = {}
}

function startEdit(id, label) {
  editing.value[id] = label
}
function saveEdit(id) {
  treeTable.value.update(id, { label: editing.value[id] })
  delete editing.value[id]
  rowData.value = treeTable.value.getList()
}
function cancelEdit(id) {
  delete editing.value[id]
}
function addChild(parentId) {
  const newId = Date.now()
  treeTable.value.add({ id: newId, parent: parentId, label: 'Новое дело' })
  rowData.value = treeTable.value.getList()
}
function removeItem(id) {
  treeTable.value.remove(id)
  rowData.value = treeTable.value.getList()
}

// Drag-and-drop через ag-Grid events
function onRowDragEnd(event) {
  // Для Community-версии drag-and-drop можно реализовать только для сортировки, не для иерархии
  // Здесь можно оставить пустым или реализовать сортировку, если нужно
}

// Колонки для ag-Grid (без agGroupCellRenderer)
const columnDefs = computed(() => {
  const base = [
    {
      headerName: 'ID',
      field: 'id',
      width: 80,
      editable: false
    },
    {
      headerName: 'Родитель',
      field: 'parent',
      width: 100,
      editable: false
    },
    {
      headerName: 'Название',
      field: 'label',
      flex: 1,
      editable: false,
      cellRenderer: (params) => {
        const id = params.data.id
        if (editing.value[id] !== undefined) {
          return `<input id='edit-input-${id}' name='edit-input-${id}' value='${editing.value[id]}' style='width:70%' />`
        }
        return params.value
      }
    }
  ]
  if (mode.value === 'edit') {
    base.push(
      {
        headerName: '',
        field: 'edit',
        width: 60,
        cellRenderer: (params) => {
          const id = params.data.id
          if (editing.value[id] !== undefined) {
            return `<button data-action='save' data-id='${id}'>💾</button><button data-action='cancel' data-id='${id}'>✖️</button>`
          }
          return `<button data-action='edit' data-id='${id}'>✏️</button>`
        },
        suppressHeaderMenuButton: true,
        suppressMovable: true
      },
      {
        headerName: '',
        field: 'add',
        width: 60,
        cellRenderer: (params) => `<button data-action='add' data-id='${params.data.id}'>➕</button>`,
        suppressHeaderMenuButton: true,
        suppressMovable: true
      },
      {
        headerName: '',
        field: 'delete',
        width: 60,
        cellRenderer: (params) => `<button data-action='delete' data-id='${params.data.id}'>🗑️</button>`,
        suppressHeaderMenuButton: true,
        suppressMovable: true
      }
    )
  }
  return base
})

// Обработка кликов по кнопкам в ячейках
function onCellClicked(event) {
  const action = event.event.target.getAttribute('data-action')
  const id = event.event.target.getAttribute('data-id')
  if (!action || !id) return
  if (action === 'edit') startEdit(Number(id), event.data.label)
  if (action === 'save') {
    const input = document.getElementById('edit-input-' + id)
    if (input) {
      treeTable.value.update(Number(id), { label: input.value })
      delete editing.value[id]
      rowData.value = treeTable.value.getList()
    }
  }
  if (action === 'cancel') cancelEdit(Number(id))
  if (action === 'add') addChild(Number(id))
  if (action === 'delete') removeItem(Number(id))
}

// AgGrid настройки (без treeData, без autoGroupColumnDef, с getRowId)
const gridOptions = {
  animateRows: true,
  getRowId: params => String(params.data.id),
  rowDragManaged: mode.value === 'edit',
  onRowDragEnd,
  onCellClicked
}
</script>

<template>
  <div>
    <div style="margin-bottom: 1em">
      <button @click="setMode('view')" :disabled="mode==='view'">Просмотр</button>
      <button @click="setMode('edit')" :disabled="mode==='edit'">Редактировать</button>
      <button v-if="mode==='edit'" @click="addChild(null)" style="margin-left:1em">Добавить корневой элемент</button>
    </div>
    <div class="ag-theme-alpine" style="height: 500px; width: 100%">
      <AgGridVue
        :rowData="rowData"
        :columnDefs="columnDefs"
        :gridOptions="gridOptions"
        :rowDragManaged="mode==='edit'"
        :animateRows="true"
        @cell-clicked="onCellClicked"
        @row-drag-end="onRowDragEnd"
        ref="gridApi"
      />
    </div>
  </div>
</template> 