<template>
  <div class="app-container">
    <div class="btn-group">
      <div class="btn-group-single">
        <div class="btn-group-single-title">项目名称</div>
        <el-input
          v-model="queryParams.project_name"
          placeholder="项目名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="getLists"
        />
      </div>
      <div class="btn-group-single">
        <div class="btn-group-single-title">违章等级</div>
        <el-select
          v-model="queryParams.issue_level"
          placeholder="违章等级"
          clearable
          size="small"
          style="width: 240px"
          @change="getLists"
        >
          <el-option
            v-for="item in options.peccancy_level"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictLabel"
          ></el-option>
        </el-select>
      </div>
<!--      <div class="btn-group-single">-->
<!--        <div class="btn-group-single-title">整改情况</div>-->
<!--        <el-select-->
<!--          v-model="queryParams.zg_flag"-->
<!--          placeholder="整改情况"-->
<!--          clearable-->
<!--          size="small"-->
<!--          style="width: 240px"-->
<!--          @change="getLists"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="item in options.peccancy_level"-->
<!--            :key="item.dictValue"-->
<!--            :label="item.dictLabel"-->
<!--            :value="item.dictLabel"-->
<!--          ></el-option>-->
<!--        </el-select>-->
<!--      </div>-->
      <el-button type="primary" icon="el-icon-search" size="mini" @click="getLists">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </div>

    <el-table v-loading="loading" :data="tableData" style="width: 100%; margin-bottom: 20px" border>
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" label="序号" width="50" align="center" :index="indexMethod" />
      <el-table-column prop="project_name" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="check_content" label="问题描述" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column
        prop="check_type"
        label="问题类型"
        width="80"
        :show-overflow-tooltip="true"
        :formatter="checkTypeFormate"
      ></el-table-column>
      <el-table-column prop="peccancy_level" label="违章等级" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="peccancy_content" label="违章库" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="check_user" label="责任人" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="fk_money" label="罚款" width="100" :show-overflow-tooltip="true"></el-table-column>
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
import { getList } from "@/api/safety/aqwthz.js";

export default {
  name: "aqwthz",
  data() {
    return {
      projectId: this.$route.params.projectId,
      loading: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      options: {}
    };
  },
  created() {
    this.getLists();
    this.getDict();
  },
  methods: {
    getLists() {
      // this.queryParams.projectId = this.projectId;
      this.loading = true;
      getList(this.queryParams).then(res => {
        this.tableData = res.data.data;
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      });
    },
    getDict() {
      this.getDicts("check_type").then(res => {
        this.options.check_type = res.data;
      });
      this.getDicts("peccancy_level").then(res => {
        this.options.peccancy_level = res.data;
      });
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
    },
    // 任务组名字典翻译
    checkTypeFormate(row, column) {
      return this.selectDictLabel(this.options.check_type, row.check_type);
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
