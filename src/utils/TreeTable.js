// Класс для управления иерархическим списком элементов (дерево)

export default class TreeTable {
  constructor(items = []) {
    this.items = items;
  }

  // Получить дерево (список с вложенностью)
  getTree() {
    const map = {};
    const roots = [];
    this.items.forEach(item => {
      map[item.id] = { ...item, children: [] };
    });
    this.items.forEach(item => {
      if (item.parent) {
        map[item.parent].children.push(map[item.id]);
      } else {
        roots.push(map[item.id]);
      }
    });
    return roots;
  }

  // Добавить элемент
  add(item) {
    this.items.push(item);
  }

  // Удалить элемент и всех его потомков
  remove(id) {
    const toRemove = new Set([id]);
    let changed;
    do {
      changed = false;
      this.items.forEach(item => {
        if (toRemove.has(item.parent)) {
          toRemove.add(item.id);
          changed = true;
        }
      });
    } while (changed);
    this.items = this.items.filter(item => !toRemove.has(item.id));
  }

  // Обновить элемент
  update(id, data) {
    const idx = this.items.findIndex(item => item.id === id);
    if (idx !== -1) {
      this.items[idx] = { ...this.items[idx], ...data };
    }
  }

  // Переместить элемент (сменить parent)
  move(id, newParent) {
    this.update(id, { parent: newParent });
  }

  // Получить копию текущего списка
  getList() {
    return JSON.parse(JSON.stringify(this.items));
  }
} 