<template>
  <div class="selection">
    <div class="selection-item">
      <div>
        柯文哲
        <div class="party" :style="{ backgroundColor: '#00C8C8' }">眾</div>
      </div>
      <p>{{ currAreaSelection.cand_1 }}%</p>
    </div>
    <div class="selection-item">
      <div>
        賴清德
        <div class="party" :style="{ backgroundColor: '#2DC46E' }">民</div>
      </div>
      <p>{{ currAreaSelection.cand_2 }}%</p>
    </div>
    <div class="selection-item">
      <div>
        侯友宜
        <div class="party" :style="{ backgroundColor: '#4A8FE7' }">國</div>
      </div>
      <p>{{ currAreaSelection.cand_3 }}%</p>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  currAreaSelection: {
    type: Object,
    default: {},
  },
});
</script>
<style lang="scss" scoped>
p {
  margin: 0;
}
.selection {
  padding: 5px 0;
  margin: 5px 0;
}
.selection-item {
  display: flex;
  justify-content: space-between;
}

.selection-item div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.party {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 50%;
  color: #fff;
}

@media screen and (max-width: 1024px) {
  .selection {
    border-top: 1px solid #c0c6d0 !important;
    border-bottom: 1px solid #c0c6d0 !important;
    padding: 5px 0;
    margin: 5px 0;
  }
}
</style>
