<template>
  <div class="app-container">
    <div class="btn-group">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="showAwh">召开安委会</el-button>
    </div>
    <el-table ref="table" :data="tableData" style="width: 100%; margin-bottom: 20px" border>
      <!-- <el-table-column type="selection" width="50" align="center" /> -->

      <el-table-column type="index" width="50" align="center" :index="indexMethod" />
      <el-table-column label="名称" :show-overflow-tooltip="true">
        <template>安委会</template>
      </el-table-column>
      <el-table-column prop="endDate" label="日期" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="参会项目" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="link-type" @click="handleExpand(scope.row,scope.$index)">参会项目</div>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1">
        <template slot-scope="props">
          <el-table :data="props.row.projectList" stripe border>
            <el-table-column type="index" width="50" align="center" :index="indexMethod" />
            <el-table-column prop="projectName" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="nickName" label="负责人" :show-overflow-tooltip="true"></el-table-column>
            <!-- <el-table-column prop="zrrTel" label="联系方式" :show-overflow-tooltip="true"></el-table-column> -->
          </el-table>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getLists"
    />
    <!-- 添加修改对话框 -->
    <el-dialog
      :title="dialogTitle"
      :before-close="handelCancel"
      :visible.sync="dialogVisible"
      width="50%"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="召开时间">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择召开时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参会项目">
              <el-scrollbar style="height:300px">
                <el-checkbox
                  :indeterminate="form.isIndeterminate"
                  v-model="form.checkAll"
                  @change="handleCheckAllChange"
                >全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group
                  v-model="form.checkedProject"
                  @change="handleCheckedProjectChange"
                  v-if="projectOptions"
                >
                  <div>
                    <el-checkbox
                      v-for="item in projectOptions"
                      :label="item.projectName"
                      :key="item.id"
                      :disabled="!item.linkUserId"
                    >
                      {{item.projectName}}
                      <span v-if="!item.linkUserId" class="text-tip">(未指定责任人)</span>
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </el-scrollbar>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
import {
  getList,
  getProjectList,
  getZjList,
  addList
} from "@/api/safety/awh.js";
import { addDb } from "@/api/manage/hydb.js";

export default {
  name: "awh",
  data() {
    return {
      projectId: this.$route.params.projectId,

      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],

      // 召开安委会
      dialogTitle: "召开安委会",
      dialogVisible: false,
      rules: {},
      form: {
        // 全选
        checkAll: false,
        checkedProject: [],
        isIndeterminate: false
      },
      projectOptions: []
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
        this.tableData = res.data.list;
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
    },
    // 主列表点击展开
    handleExpand(row, index) {
      let $table = this.$refs.table;
      $table.toggleRowExpansion(row);
      getProjectList({ hyTime: row.endDate }).then(res => {
        this.$set(this.tableData[index], "projectList", res.data);
      });
    },
    // 打开弹窗
    showAwh() {
      this.dialogVisible = true;
      getZjList().then(res => {
        this.projectOptions = res.data;
      });
    },
    handelCancel() {
      this.dialogVisible = false;
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
    },

    // 提交安委会
    submitForm() {
      let userList = "";
      this.projectOptions.forEach(item => {
        if (this.form.checkedProject.indexOf(item.projectName) !== -1) {
          if (item.nickName) {
            userList += userList ? "," + item.nickName : item.nickName;
          }
        }
      });
      let yjContent = `${this.form.endDate}召开安委会`;
      addList({
        projectId: "00a44f2d-9287-4d76-95d7-5dc01248059b",
        projectName: "泰兴500kV变电站保护改造工程",
        status: "0"
      }).then(res => {});
      addDb({
        yjContent: yjContent,
        receiveUser: userList,
        endDate: this.form.endDate,
        yjTitle: "安委会"
      }).then(res => {
        this.$message({
          type: "success",
          message: "已通知参会人！"
        });
      });
    },

    // 全选
    handleCheckAllChange(val) {
      this.$set(
        this.form,
        "checkedProject",
        val ? this.projectOptions.map(item => item.projectName) : []
      );
      this.form.isIndeterminate = false;
    },
    handleCheckedProjectChange(value) {
      let checkedCount = value.length;
      this.form.checkAll = checkedCount === this.projectOptions;
      this.form.isIndeterminate =
        checkedCount > 0 && checkedCount < this.projectOptions;
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
<style lang="scss" scoped>
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>