<template>
  <div class="app-container">
    <!-- 对话框 -->
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
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="hy_time" label="会议时间"> </el-table-column>
      <el-table-column prop="project_name" label="项目名称"> </el-table-column>
      <el-table-column prop="meet_name" label="会议名称"> </el-table-column>
      <el-table-column prop="hycl_file_id" label="会议材料"> </el-table-column>
      <el-table-column prop="hyjy_file_id" label="会议纪要"> </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
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
            <el-form-item label="会议时间" prop="hy_time">
              <el-input v-model="form.hy_time" placeholder="分类名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目名称" prop="project_name">
              <el-input v-model="form.project_name" placeholder="所属部门" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议名称" prop="meet_name">
              <el-input v-model="form.meet_name" placeholder="会议名称" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getControlList, addControl } from "@/api/safety/awh.js";

export default {
  name: "awh",
  data() {
    return {
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      form: {},
      tableData: [],
      options: {},
      dialogVisible: false,
      dialogTitle: "",
      isAdd: false,
      ids: [],
      single: true,
      multiple: true,
      currentForm: {},
      parent_id: 0,
      rules: {
        name: [{ required: true, message: "请填写分类名称", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getControlList().then((res) => {
        console.log(res);
        this.tableData = res.data.data;
      });
    },

    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增安委会类型";
      this.isAdd = true;
    },
    handelCancel() {
      this.dialogVisible = false;
      this.dialogTitle = "";
      this.form = {};
    },
    handleFileUploadProgress() {
      this.upload.isUploading = true;
    },
    submitForm() {
      this.$refs.form.validate((value) => {
        if (value) {
          addControl({}).then((res) => {
            // console.log(res);
            this.handelCancel();
            this.getList();
            this.msgSuccess(res.msg);
          });
        }
      });
    },
  },
};
</script>
  
<style lang="scss" scoped>
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>