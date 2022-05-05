<template>
  <div class="app-container">
    <div class="btn-group">
      <div class="btn-group-single">
        <div class="btn-group-single-title">文件名称</div>
        <el-input
          v-model="queryParams.wjName"
          placeholder="文件名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="getList"
        />
      </div>
      <div class="btn-group-single">
        <div class="btn-group-single-title">会议类型</div>
        <el-input
          v-model="queryParams.hyType"
          placeholder="会议类型"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="getList"
        />
      </div>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
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
      <el-table-column type="index" width="50" label="序号"></el-table-column>

      <el-table-column prop="wjName" label="文件名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="hyType" label="会议类型" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="operName" label="上传人" :show-overflow-tooltip="true"></el-table-column>

      <el-table-column prop="operTime" label="上传时间" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="fileId" label="附件" :show-overflow-tooltip="true" width="200">
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
    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />-->
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
            <el-form-item label="文件名称" prop="wjName">
              <el-input v-model="form.wjName" placeholder="请输入文件名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议类型" prop="hyType">
              <el-input v-model="form.hyType" placeholder="请输入会议类型" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上传人" prop="operName">
              <el-input v-model="form.operName" placeholder="请输入上传人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上传附件" prop="fileId">
              <el-upload
                ref="upload"
                :limit="1"
                :action="upload.url"
                :headers="upload.headers"
                :file-list="upload.fileList"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
              >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" type="primary" @click="submitForm" :loading="upload.isUploading">确 定</el-button>
        <el-button v-else type="primary" @click="updateForm" :loading="upload.isUploading">确 定</el-button>
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";
import { commonDownload } from "@/utils/index";
import { getToken } from "@/utils/auth";
import {
  getGfwjList,
  addGfwjList,
  updateGfwjList,
  delGfwjList
} from "@/api/manage/gfwj.js";
export default {
  name: "gfwj",
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
        url: process.env.VUE_APP_BASE_API + "/common/upload",
        // 上传的文件列表
        fileList: [],

        updateSupport: false
      },

      total: 0,
      queryParams: {
        // pageNum: 1,
        // pageSize: 10
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
        fileType: [
          { required: true, message: "请选择文件类型", trigger: "change" }
        ],
        wjName: [
          { required: true, message: "请输入文件名称", trigger: "blur" }
        ],

        operName: [
          { required: true, message: "请输入上传人", trigger: "blur" }
        ],

        fileId: [{ required: true, message: "请上传附件", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
    this.getDict();
  },
  methods: {
    getList() {
      this.queryParams.fileType = "2";
      getGfwjList(this.queryParams).then(res => {
        this.tableData = res.rows;
      });
    },
    getDict() {
      this.getDicts("gfwj_type").then(res => {
        this.options.gfwj_type = res.data;
      });
    },
    fileTypeFormat(row) {
      if (this.options.gfwj_type)
        return this.selectDictLabel(this.options.gfwj_type, row.fileType);
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增会议材料";
      this.isAdd = true;
    },
    handleUpdate() {
      this.dialogVisible = true;
      this.dialogTitle = "修改会议材料";
      this.isAdd = false;
      this.form = this.currentForm;
    },
    handleSelectionChange(selection) {
      this.single = selection.length !== 1;
      if (this.single) {
        this.currentForm = {};
      } else {
        this.currentForm = selection[0];
      }
      this.multiple = selection.length === 0;
      if (this.multiple) {
        this.ids = [];
      } else {
        this.ids = selection.map(item => item.id);
      }
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
      this.$set(this.form, "fileId", response.fileId);
      this.form.projectId = this.projectId;
      let time = parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}");
      this.form.operTime = time;
    },
    submitForm() {
      this.$refs.form.validate(value => {
        if (value) {
          this.form.fileType = "2";
          addGfwjList(this.form).then(res => {
            this.handelCancel();
            this.getList();
            this.msgSuccess(res.msg);
          });
        }
      });
    },
    updateForm() {
      this.form.fileType = "2";
      updateGfwjList(this.form).then(res => {
        this.handelCancel();
        this.getList();
        this.msgSuccess(res.msg);
      });
    },
    // 删除
    handleDelete() {
      this.$confirm("是否确认删除数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          return delGfwjList(this.ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleDownload(row) {
      this.download(row.fileName);
      // commonDownload(row.fileId);
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