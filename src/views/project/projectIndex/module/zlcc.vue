<template>
  <div class="app-container">
    <el-table
      v-if="loaded"
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column prop="checkTime" label="检查时间" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column
        prop="checkType"
        label="检查类型"
        :show-overflow-tooltip="true"
        :formatter="typeFormat"
      ></el-table-column>
      <el-table-column label="检查照片" :show-overflow-tooltip="true" width="100">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.photoPath"
            style="width: 50px; height: 20px"
            :src="scope.row.photoPath"
            :preview-src-list="[scope.row.photoPath]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="checkContent" label="问题描述" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="检查整改清单" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.checkFileId"
            size="mini"
            @click="handleDownload(scope.row.fileName)"
          >下载</el-button>
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
import { getCheckList } from "@/api/project/project.js";
export default {
  name: "zlcc",
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
    getList() {
      getCheckList({ projectId: this.projectId, checkSource: "质量抽查" }).then(
        res => {
          this.tableData = res.rows;
        }
      );
    },
    getDict() {
      this.getDicts("check_type").then(res => {
        this.options.check_type = res.data;
        this.loaded = true;
      });
    },
    typeFormat(value) {
      return this.selectDictLabel(this.options.check_type, value.checkType);
    }
  }
};
</script>

<style  lang="scss">
</style>