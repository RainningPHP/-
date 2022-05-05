<template>
  <div>
    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" border>
      <!-- <el-table-column type="selection" width="50" align="center" /> -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table v-if="props.row.project_name==='大跨越线路工程'" :data="southWorker" stripe border>
            <el-table-column type="index" width="50" align="center" :index="indexMethod" />
            <el-table-column prop="name" label="姓名" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="sex" label="性别" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="role" label="工种" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="job" label="职务" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="address" label="地址" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <!-- <el-table-column type="index" width="50" align="center" :index="indexMethod" /> -->
      <el-table-column prop="project_name" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="total" label="当日在场人数" :show-overflow-tooltip="true"></el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getLists"
    />
  </div>
</template>
<script>
import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
import { getCall } from "@/api/safety/rygl.js";

export default {
  name: "drzczrs",
  data() {
    return {
      projectId: this.$route.params.projectId,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: "大跨越线路工程"
      },
      tableData: [],
      // 大跨人员
      southWorker: []
    };
  },
  created() {
    this.getLists();
    this.getDict();
  },
  methods: {
    getLists() {
      // this.queryParams.projectId = this.projectId;

      getCall(this.queryParams).then(res => {
        this.tableData = res.resultList.sort((a, b) => b.total - a.total);
        this.southWorker = res.southWorker;
      });
    },
    getDict() {
      // this.getDicts("liberary_type").then(res => {
      //   this.options.liberary_type = res.data;
      // });
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        projectName: "大跨越线路工程"
      };
      this.getLists();
    },
    indexMethod(index) {
      return (this.queryParams.pageNum - 1) * 10 + index + 1;
    }
  },
  filters: {
    emplisisText(value) {
      if (value && value.length > 10) {
        return value.substring(0, 10) + "···";
      } else {
        return value;
      }
    }
  }
};
</script>