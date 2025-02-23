<template>
    <div class="flex h-screen">
        <template v-if="isRight">
            <div class="resizer" @mousedown="startResize" @mouseup="stopResize"></div>
            <div class="panel flex flex-col gap-2 app-drag justify-between" id="resizable_panel"
                :style="{ width: `${panelWidth}px` }">
                <slot></slot>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Panel position and width state
const isRight = ref(true);
const panelWidth = ref(200);

// Min and max width constraints
const minWidth = 100;
const maxWidth = ref(500);

// Resize state
const isResizing = ref(false);
let startX = 0;
let startWidth = 0;

// Toggle panel position


// Update max width on window resize
const updateMaxWidth = () => {
    maxWidth.value = window.innerWidth - 100;
};

// Resize handler
const resize = (event) => {
    if (!isResizing.value) return;

    if (isRight.value) {
        // Для правой панели
        const diff = startX - event.clientX;
        const newWidth = Math.max(minWidth, Math.min(startWidth + diff, maxWidth.value));
        panelWidth.value = newWidth;
    } else {
        // Для левой панели
        const newWidth = Math.max(minWidth, Math.min(event.clientX, maxWidth.value));
        panelWidth.value = newWidth;
    }
};

// Start resize
const startResize = (event) => {
    isResizing.value = true;
    startX = event.clientX;
    startWidth = panelWidth.value;
    document.body.style.userSelect = 'none'; // Disable text selection
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
};

// Stop resize
const stopResize = () => {
    isResizing.value = false;
    document.body.style.userSelect = ''; // Re-enable text selection
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
};

// Lifecycle hooks
onMounted(() => {
    updateMaxWidth();
    window.addEventListener('resize', updateMaxWidth);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateMaxWidth);
});
</script>

<style scoped>
.resizer {
    width: 4px;
    background-color: #333;
    cursor: col-resize;
    transition: background-color 0.2s;
    position: relative;
    z-index: 1;
}

.resizer:hover {
    background-color: #555;
}

.resizer::after {
    content: '';
    position: absolute;
    top: 0;
    left: -3px;
    right: -3px;
    bottom: 0;
    cursor: col-resize;
}

.panel {
    background-color: #1e1e1e;
    color: white;
    min-width: 100px;
}

.content {
    display: none;
    flex-grow: 1;
    background-color: #252526;
    color: white;
    min-width: 100px;
}
</style>