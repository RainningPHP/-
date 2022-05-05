<template>
  <div class="app-container">
    <el-table
      v-if="loaded"
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column
        prop="meetingType"
        label="会议类型"
        :show-overflow-tooltip="true"
        :formatter="typeFormat"
      ></el-table-column>
      <el-table-column prop="meetingName" label="会议名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="meetingTime" label="会议时间" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="照片" :show-overflow-tooltip="true" width="100">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 20px"
            :src="scope.row.photoPath"
            :preview-src-list="[scope.row.photoPath]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="meetFileContent" label="会议纪要内容" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="meetingDuration" label="会议时长" :show-overflow-tooltip="true"></el-table-column>
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
import { getMeetingsList } from "@/api/project/project.js";
export default {
  name: "dycgdlh",
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
      getMeetingsList({ projectId: this.projectId, meetingType: "7" }).then(
        res => {
          this.tableData = res.rows;
        }
      );
    },
    getDict() {
      this.getDicts("meeting_type").then(res => {
        this.options.meeting_type = res.data;
        this.loaded = true;
      });
    },
    typeFormat(value) {
      return this.selectDictLabel(this.options.meeting_type, value.meetingType);
    }
  }
};
</script>

<style  lang="scss">
</style>