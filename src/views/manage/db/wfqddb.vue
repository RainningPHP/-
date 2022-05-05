<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="发起人"> </el-table-column>
      <el-table-column prop="date" label="发起日期"></el-table-column>
      <el-table-column prop="address" label="附件"> </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    };
  },
};
</script>