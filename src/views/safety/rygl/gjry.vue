<template>
  <div>
    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" border>
      <!-- <el-table-column type="selection" width="50" align="center" /> -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table v-if="props.row.zrrList.length" :data="props.row.zrrList" stripe border>
            <el-table-column type="index" width="50" align="center" :index="indexMethod" />
            <el-table-column prop="zrrPosition" label="职位" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="zrrName" label="姓名" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="zrrTel" label="联系方式" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <!-- <el-table-column type="index" width="50" align="center" :index="indexMethod" /> -->
      <el-table-column label="项目名称" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{scope.row.project.projectName}}</template>
      </el-table-column>
      <el-table-column label="人员数" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{scope.row.zrrList.length}}</template>
      </el-table-column>
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
import { getList } from "@/api/safety/rygl.js";

export default {
  name: "gjry",
  data() {
    return {
      projectId: this.$route.params.projectId,

      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: []
    };
  },
  created() {
    this.getLists();
    this.getDict();
  },
  methods: {
    getLists() {
      // this.queryParams.projectId = this.projectId;

      getList(this.queryParams).then(res => {
        this.tableData = res.data.sort(
          (a, b) => b.zrrList.length - a.zrrList.length
        );
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
        pageSize: 10
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