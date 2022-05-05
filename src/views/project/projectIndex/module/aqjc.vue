<template>
  <div class="app-container">
    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" border v-if="dictLoaded">
      <!-- <el-table-column type="selection" width="50" align="center" /> -->

      <el-table-column prop="checkTime" label="检查时间" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column
        prop="checkType"
        label="检查类型"
        :show-overflow-tooltip="true"
        :formatter="typeFormat"
      ></el-table-column>
      <el-table-column prop="checkContent" label="问题描述" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="checkDuration" label="检查时长" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="检查整改清单" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.checkFileId"
            size="mini"
            @click="handleDownload(scope.row.checkFileId)"
          >下载</el-button>
        </template>
      </el-table-column>
      <el-table-column label="检查照片" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 20px"
            :src="scope.row.photoPath"
            :preview-src-list="[scope.row.photoPath]"
          ></el-image>
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
import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
import { getCheckList, commonDownload } from "@/api/project/project.js";
export default {
  name: "aqjc",
  data() {
    return {
      projectId: this.$route.params.projectId,
      queryParams: {},
      total: 0,
      tableData: [],
      dictLoaded: false,
      options: {}
    };
  },
  created() {
    this.getList();
    this.getDict();
  },
  mounted() {
    this.dictLoaded = true;
  },
  methods: {
    getList() {
      this.queryParams.projectId = this.projectId;
      this.queryParams.checkType = "2";

      getCheckList(this.queryParams).then(res => {
        this.tableData = res.rows;
      });
    },
    handleDownload(checkFileId) {
      commonDownload(checkFileId);
    },
    getDict() {
      this.getDicts("check_type").then(res => {
        this.options.check_type = res.data;
      });
    },
    typeFormat(row) {
      // if (this.options.check_type)
      return this.selectDictLabel(this.options.check_type, row.checkType);
    }
  }
};
</script>