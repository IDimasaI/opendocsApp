export default function isEqual(obj1: any, obj2: any, visited = new WeakSet()): boolean {
    // Если оба значения примитивы (или null/undefined), сравниваем их напрямую
    if (obj1 === obj2) return true;

    // Если один из объектов null или не является объектом, возвращаем false
    if (obj1 === null || typeof obj1 !== 'object' || obj2 === null || typeof obj2 !== 'object') {
        return false;
    }

    // Если объекты уже были посещены, возвращаем true (избегаем бесконечной рекурсии)
    if (visited.has(obj1) || visited.has(obj2)) {
        return true;
    }

    // Добавляем объекты в WeakSet, чтобы отслеживать их
    visited.add(obj1);
    visited.add(obj2);

    // Получаем ключи обоих объектов
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Если количество ключей разное, объекты не равны
    if (keys1.length !== keys2.length) return false;

    // Рекурсивно сравниваем значения каждого ключа
    for (const key of keys1) {
        if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key], visited)) {
            return false;
        }
    }

    return true;
}