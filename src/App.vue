<script>
import TreeTable from './components/TreeTable.vue'
import TestAgGrid from './components/TestAgGrid.vue'

export default {
  components: { TreeTable, TestAgGrid }
}
</script>

<template>
  <main>
    <TreeTable />
    <TestAgGrid />
  </main>
</template>

<style scoped>
main {
  padding: 2rem;
  display: flex;
  gap: 2rem;
}
</style>
