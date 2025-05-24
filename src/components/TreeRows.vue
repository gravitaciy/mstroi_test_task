<script setup>
defineProps({
  nodes: Array,
  level: Number
})
const emit = defineEmits(['startEdit', 'saveEdit', 'cancelEdit', 'addChild', 'removeItem', 'onDragStart', 'onDrop', 'onDragEnd'])
import { inject } from 'vue'
const mode = inject('mode')
const editing = inject('editing')
const startEdit = inject('startEdit')
const saveEdit = inject('saveEdit')
const cancelEdit = inject('cancelEdit')
const addChild = inject('addChild')
const removeItem = inject('removeItem')
const onDragStart = inject('onDragStart')
const onDrop = inject('onDrop')
const onDragEnd = inject('onDragEnd')
</script>

<template>
  <template v-for="node in nodes" :key="node.id">
    <tr
      :draggable="mode === 'edit'"
      @dragstart="onDragStart(node.id)"
      @dragover.prevent
      @drop="onDrop(node.id)"
      @dragend="onDragEnd"
    >
      <td :style="{ paddingLeft: (level * 24) + 'px' }">
        <template v-if="editing[node.id] !== undefined">
          <input
            v-model="editing[node.id]"
            :id="'edit-input-' + node.id"
            :name="'edit-input-' + node.id"
            style="width:70%"
          />
          <button @click="saveEdit(node.id)">Сохранить</button>
          <button @click="cancelEdit(node.id)">Отмена</button>
        </template>
        <template v-else>
          {{ node.label }}
          <span v-if="mode === 'edit'">
            <button @click="startEdit(node.id, node.label)">✏️</button>
          </span>
        </template>
      </td>
      <td v-if="mode === 'edit'">
        <button @click="addChild(node.id)">➕</button>
        <button @click="removeItem(node.id)">🗑️</button>
      </td>
    </tr>
    <TreeRows v-if="node.children && node.children.length" :nodes="node.children" :level="level + 1" />
  </template>
</template>
