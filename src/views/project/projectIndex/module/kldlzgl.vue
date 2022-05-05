<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="projectName" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sbName" label="停电设备" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="startDate" label="开始时间" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="endDate" label="结束时间" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="tdDay" label="停电天数" :show-overflow-tooltip="true" width="100"></el-table-column>
      <el-table-column prop="workDetail" label="工作内容" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="gcFl" label="工程分类" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="gcXz" label="工程性质" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sbType" label="停电设备类型" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="workDw" label="工作单位" :show-overflow-tooltip="true"></el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :data="{projectId,updateSupport:upload.updateSupport}"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据 -->
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
import mixin from "./components/normal.vue";
import {
  getTdjhList,
  downloadTdDefault,
  delTdjhFile
} from "@/api/project/project.js";
export default {
  name: "kldlzgl",
  mixins: [mixin],
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
        url: process.env.VUE_APP_BASE_API + "/system/td/importData",
        // 上传的文件列表
        fileList: [],

        updateSupport: false
      }
    };
  },
  methods: {
    getList() {
      getTdjhList({ projectId: this.projectId }).then(res => {
        this.tableData = res.rows;
      });
    },
    handleImport() {
      this.upload.title = "停电计划导入";
      this.upload.open = true;
    },
    // 文件上传
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    importTemplate() {
      downloadTdDefault().then(res => {
        this.download(res.msg);
      });
    },
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 删除
    handleDelete() {
      this.$confirm("是否确认删除数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          return delTdjhFile(this.ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style  lang="scss">
.el-tooltip__popper.is-dark {
  max-width: 80%;
}
</style>