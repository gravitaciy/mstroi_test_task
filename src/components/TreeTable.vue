<script setup>
import { ref, computed } from 'vue'
import TreeTable from '../utils/TreeTable'

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

<script>
// Вложенный компонент для рекурсивного отображения строк
export default {
  components: {
    TreeRows: {
      props: ['nodes', 'level'],
      inject: ['mode', 'editing', 'startEdit', 'saveEdit', 'cancelEdit', 'addChild', 'removeItem', 'onDragStart', 'onDrop', 'onDragEnd'],
      template: `
        <template v-for="node in nodes">
          <tr
            :draggable="mode==='edit'"
            @dragstart="onDragStart(node.id)"
            @dragover.prevent
            @drop="onDrop(node.id)"
            @dragend="onDragEnd"
          >
            <td :style="{ paddingLeft: (level * 24) + 'px' }">
              <template v-if="editing[node.id] !== undefined">
                <input v-model="editing[node.id]" style="width:70%" />
                <button @click="saveEdit(node.id)">Сохранить</button>
                <button @click="cancelEdit(node.id)">Отмена</button>
              </template>
              <template v-else>
                {{ node.label }}
                <span v-if="mode==='edit'">
                  <button @click="startEdit(node.id, node.label)">✏️</button>
                </span>
              </template>
            </td>
            <td v-if="mode==='edit'">
              <button @click="addChild(node.id)">➕</button>
              <button @click="removeItem(node.id)">🗑️</button>
            </td>
          </tr>
          <TreeRows v-if="node.children && node.children.length" :nodes="node.children" :level="level+1" />
        </template>
      `
    }
  },
  provide() {
    return {
      mode: this.mode,
      editing: this.editing,
      startEdit: this.startEdit,
      saveEdit: this.saveEdit,
      cancelEdit: this.cancelEdit,
      addChild: this.addChild,
      removeItem: this.removeItem,
      onDragStart: this.onDragStart,
      onDrop: this.onDrop,
      onDragEnd: this.onDragEnd
    }
  }
}
</script> 