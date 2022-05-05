<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8" v-if="!isParent">
      <el-col :span="1.5">
        <el-button size="small" type="primary" @click="showAdd">添加文件</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column prop="fileType" label="文件类型" :formatter="typeFormat"></el-table-column>
      <el-table-column prop="fileNo" label="文件编号"></el-table-column>
      <el-table-column prop="fileDate" label="时间"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="showDownloadDialog(scope.row)"
          >{{scope.row.fileCount}}个附件可下载</el-button>
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
    <!-- 上传文件对话框 -->
    <el-dialog
      title="上传文件"
      :before-close="handelCancel"
      :visible.sync="dialogVisible"
      width="50%"
      append-to-body
    >
      <el-form ref="upload" :model="fileForm" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="文件类型" prop="fileType">
              <el-select v-model="fileForm.fileType" placeholder="请选择">
                <el-option
                  v-for="item in options.fileType"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文件编号" prop="fileNo">
              <el-input v-model="fileForm.fileNo" placeholder="请输入文件编号" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="时间" prop="fileDate">
              <el-date-picker
                clearable
                size="small"
                v-model="fileForm.fileDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选取文件" prop="fileId">
              <el-upload
                :limit="1"
                :action="upload.url"
                :headers="upload.headers"
                :file-list="upload.fileList"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
              >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm" :loading="upload.isUploading">确 定</el-button>
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="下载附件"
      :before-close="handelCancelDownload"
      :visible.sync="dialogVisibleDownload"
      width="50%"
      append-to-body
    >
      <el-table
        :data="tableDataDownload"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
      >
        <el-table-column prop="fileType" label="文件类型" :formatter="typeFormat"></el-table-column>
        <el-table-column prop="fileNo" label="文件编号"></el-table-column>
        <el-table-column prop="fileDate" label="时间"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.fileName" placement="top">
              <el-button
                size="mini"
                @click="handleDownload(scope.row)"
              >{{scope.row.fileName | emplisisText}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";
import mixin from "./components/normal.vue";
import { getToken } from "@/utils/auth";
import {
  updateZcxwjList,
  getZcxwjList,
  getZcxwjListDoc,
  commonDownload
} from "@/api/project/project.js";
export default {
  name: "zcxwj",
  mixins: [mixin],
  data() {
    return {
      fileForm: {},
      rules: {
        fileType: [
          { required: true, message: "请输入文件类型", trigger: "change" }
        ],
        fileNo: [
          { required: true, message: "请输入文件编号", trigger: "blur" }
        ],
        fileDate: [
          { required: true, message: "请选择时间", trigger: "change" }
        ],
        fileId: [{ required: true, message: "请选取文件", trigger: "blur" }]
      },

      //下载
      dialogVisibleDownload: false,
      tableDataDownload: [],
      options: {}
    };
  },
  created() {
    this.getDict();
    this.getList();
    this.getInfo();
  },

  methods: {
    getList() {
      getZcxwjList(this.projectId).then(res => {
        this.tableData = res.rows;
      });
    },
    getDict() {
      this.getDicts("zcxwj_type").then(res => {
        this.options.fileType = res.data;
      });
    },
    // 文件上传
    submitFileForm() {
      this.$refs.upload.validate(value => {
        if (value) {
          this.fileForm.status = 1;
          updateZcxwjList(this.fileForm).then(res => {
            this.submitSuccess();
            this.msgSuccess(res.msg);
          });
        }
      });
    },

    typeFormat(row) {
      if (this.options.fileType)
        return this.selectDictLabel(this.options.fileType, row.fileType);
    },

    showDownloadDialog(row) {
      this.dialogVisibleDownload = true;
      // 获取附件数据
      getZcxwjListDoc({
        projectId: row.projectId,
        fileType: row.fileType
      }).then(res => {
        this.tableDataDownload = res.rows;
      });
    },
    handelCancelDownload() {
      this.dialogVisibleDownload = false;
      this.tableDataDownload = [];
    }
  }
};
</script>

<style>
</style>