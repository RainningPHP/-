<template>
  <div class="app-container">
    <el-table
      v-if="loaded"
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column prop="projectName" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column
        prop="projectType"
        label="项目建设类别"
        :show-overflow-tooltip="true"
        :formatter="projectTypeFormat"
      ></el-table-column>
      <el-table-column prop="scheduleType" label="进度类别" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="scheduleName" label="进度名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="scheduleValue" label="进度数值" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column
        prop="scheduleLevel"
        label="进度层级"
        :show-overflow-tooltip="true"
        :formatter="scheduleLevelFormat"
      ></el-table-column>
      <el-table-column label="操作" :show-overflow-tooltip="true" width="100">
        <template slot-scope="scope">
          <el-button size="mini" @click="getDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getScheduleList, getProjectInfo } from "@/api/project/project.js";
export default {
  name: "ssjd",
  data() {
    return {
      projectId: this.$route.params.projectId,
      tableData: [],
      queryParams: {
        pageNum: 0,
        pageSize: 10
      },
      total: 0,
      options: {},
      loaded: false
    };
  },
  created() {
    this.getList();
    this.getDict();
  },
  methods: {
    getInfo(res) {
      return getScheduleList({
        projectId: this.projectId,
        projectType: res.data.projectType
      });
    },
    getList() {
      getProjectInfo(this.projectId)
        .then(this.getInfo)
        .then(res => {
          this.tableData = res.data;
        });
    },
    getDict() {
      this.getDicts("project_type").then(res => {
        this.options.project_type = res.data;
        this.loaded = true;
      });
    },
    projectTypeFormat(row) {
      return this.selectDictLabel(this.options.project_type, row.projectType);
    },
    scheduleLevelFormat(row) {
      let map = {
        1: "第一层级",
        2: "第二层级",
        3: "第三层级"
      };
      return map[row.scheduleLevel];
    },
    getDetail() {}
  }
};
</script>

<style  lang="scss">
</style>