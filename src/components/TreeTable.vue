<script setup>
import { ref, computed, provide } from 'vue'
import TreeTable from '../utils/TreeTable.js'
import TreeRows from './TreeRows.vue'

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

const tree = computed(() => treeTable.value.getTree())

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
}
function cancelEdit(id) {
  delete editing.value[id]
}
function addChild(parentId) {
  const newId = Date.now()
  treeTable.value.add({ id: newId, parent: parentId, label: 'Новое дело' })
}
function removeItem(id) {
  treeTable.value.remove(id)
}
// Drag-and-drop
function onDragStart(id) {
  dragId.value = id
}
function onDrop(targetId) {
  if (dragId.value && dragId.value !== targetId) {
    treeTable.value.move(dragId.value, targetId)
    dragId.value = null
  }
}
function onDragEnd() {
  dragId.value = null
}

provide('mode', mode)
provide('editing', editing)
provide('startEdit', startEdit)
provide('saveEdit', saveEdit)
provide('cancelEdit', cancelEdit)
provide('addChild', addChild)
provide('removeItem', removeItem)
provide('onDragStart', onDragStart)
provide('onDrop', onDrop)
provide('onDragEnd', onDragEnd)
</script>

<template>
  <div>
    <div style="margin-bottom: 1em">
      <button @click="setMode('view')" :disabled="mode==='view'">Просмотр</button>
      <button @click="setMode('edit')" :disabled="mode==='edit'">Редактировать</button>
    </div>
    <table border="1" cellpadding="4" cellspacing="0" style="width:100%">
      <thead>
        <tr>
          <th>Название</th>
          <th v-if="mode==='edit'">Действия</th>
        </tr>
      </thead>
      <tbody>
        <TreeRows :nodes="tree" :level="0" />
      </tbody>
    </table>
  </div>
</template> 