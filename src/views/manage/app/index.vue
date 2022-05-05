<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column prop="version" label="版本名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="code" label="版本编号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="remark" label="更新内容" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="update_time" label="时间" :show-overflow-tooltip="true"></el-table-column>
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
      :close-on-click-modal="false"
      width="50%"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="版本名称" prop="version">
              <el-input v-model="form.version" placeholder="请输入版本" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="版本编号号" prop="code">
              <el-input v-model="form.code" placeholder="请输入版本" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="更新内容" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入更新内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上传app" prop="download_link">
              <el-upload
                ref="upload"
                :limit="1"
                :action="upload.url"
                :headers="upload.headers"
                :file-list="upload.fileList"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
                :on-error="handerFileError"
              >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" type="primary" @click="submitForm" :loading="upload.isUploading">确 定</el-button>
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { addApp, getAppList } from "@/api/manage/app.js";
export default {
  name: "liberaryIndex",
  data() {
    return {
      // 用户导入参数
      upload: {
        open: false,
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: window.uploadUrl,
        // 上传的文件列表
        fileList: [],
        updateSupport: false
      },

      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
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
      rules: {
        version: [
          { required: true, message: "请填写版本名称", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请填写版本编号", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请填写更新内容", trigger: "blur" }
        ],
        download_link: [{ required: true, message: "请上传app", trigger: "change" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getAppList().then(res => {
        this.tableData = res.data;
      });
    },
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增APP版本";
      this.isAdd = true;
    },
    handelCancel() {
      this.dialogVisible = false;
      this.dialogTitle = "";
      this.form = {};
      this.$refs.upload.clearFiles();
    },
    handleFileUploadProgress() {
      this.upload.isUploading = true;
    },
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      this.$message({
        message: response.msg,
        type: "success"
      });
      this.$set(this.form, "download_link", response.data.file_path);
    },
    handerFileError(err, file, fileList) {
      // let myError = err.toString(); //转字符串
      // myError = myError.replace("Error: ", ""); //去掉前面的
      // myError = JSON.parse(myError); //转对象=
      // this.$message({
      //   message: myError.msg,
      //   type: "error"
      // });
    },
    submitForm() {
      this.$refs.form.validate(value => {
        if (value) {
          addApp(this.form).then(res => {
            this.handelCancel();
            this.getList();
            this.msgSuccess(res.msg);
          });
        }
      });
    },
    handleDownload(row) {
      console.log(row.fileName);
      this.download(row.fileName);
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
