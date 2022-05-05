<template>
  <div class="app-container">
    
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
    </el-row>
      <el-tab-pane label="我收到的待办" name="wsdddb" lazy>
        <wsdddb v-if="updateTag && activeName === 'wsdddb'"></wsdddb>
      </el-tab-pane>
      <el-tab-pane label="我发起的待办" name="wfqddb" lazy>
        <wfqddb v-if="updateTag && activeName === 'wfqddb'"></wfqddb>
      </el-tab-pane>
      <el-tab-pane label="已处理的待办" name="yclddb" lazy>
        <yclddb v-if="updateTag && activeName === 'yclddb'"></yclddb>
      </el-tab-pane>
    </el-tabs>

    
  </div>
</template>

<script>
import developping from "@/views/error/developping.vue";
import Wsdddb from "./wsdddb.vue";
import Wfqddb from "./wfqddb.vue";
import Yclddb from "./yclddb.vue";

export default {
  name: "db",
  components: {
    developping,
    Wsdddb,
    Wfqddb,
    Yclddb,
  },
  data() {
    return {
      activeName: "wsdddb",
      updateTag: true,
    };
  },
  methods: {
    handleClick(tab, event) {
      this.updateTag = false;
      this.$nextTick(() => {
        this.updateTag = true;
      });
    },
  },
  handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增待办";
      this.isAdd = true;
    },
};
</script>
