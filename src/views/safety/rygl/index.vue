<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="关键人员" name="gjry" lazy>
        <gjry v-if="updateTag && activeName==='gjry'"></gjry>
      </el-tab-pane>
      <el-tab-pane label="当日在场总人数" name="drzczrs" lazy>
        <drzczrs v-if="updateTag && activeName==='drzczrs'"></drzczrs>
      </el-tab-pane>
    </el-tabs>
    <!-- <developping></developping> -->
  </div>
</template>

<script>
import gjry from "./gjry";
import drzczrs from "./drzczrs";
export default {
  name: "rygl",
  components: {
    gjry,
    drzczrs
  },
  data() {
    return {
      activeName: "gjry",
      updateTag: true
    };
  },
  methods: {
    handleClick(tab, event) {
      this.updateTag = false;
      this.$nextTick(() => {
        this.updateTag = true;
      });
    }
  }
};
</script>

<style>
</style>