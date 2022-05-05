<template>
  <div class="app-container">
    <div class="btn-group">
      <div class="btn-group-single">
        <div class="btn-group-single-title">预算执行率</div>
        <el-input
          v-model="queryParams.budgetMargin"
          placeholder="预算执行率"
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
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>-->
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
      <el-table-column prop="projectName" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="projectNo" label="项目编号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="projectDyLevel" label="电压等级" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="projectBudget" label="不含税预算(万)" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="projectAmount" label="不含税发生额预算" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="budgetRate" label="预算执行率" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="budgetMargin" label="预算差额" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="budgetPercent" label="预算差额占比" :show-overflow-tooltip="true"></el-table-column>
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
            <el-form-item label="项目名称">{{form.projectName}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目编号">{{form.projectNo}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="电压等级">{{form.projectDyLevel}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="不含税预算(万)" prop="projectBudget">
              <el-input v-model="form.projectBudget" placeholder="请输入不含税预算(万)" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="不含税发生额预算" prop="projectAmount">
              <el-input v-model="form.projectAmount" placeholder="请输入不含税发生额预算" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="预算执行率" prop="budgetRate">
              <el-input v-model="form.budgetRate" placeholder="请输入预算执行率" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="预算差额" prop="budgetMargin">
              <el-input v-model="form.budgetMargin" placeholder="请输入预算差额" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="预算差额占比" prop="budgetPercent">
              <el-input v-model="form.budgetPercent" placeholder="请输入预算差额占比" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" type="primary" @click="submitForm">确 定</el-button>
        <el-button v-else type="primary" @click="updateForm">确 定</el-button>
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
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
// import { getProjectInfo } from "@/api/project/project.js";
import {
  addYsjhList,
  getYsjhList,
  updateYsjhList,
  delYsjhList,
  downloadYsjhDefault
} from "@/api/manage/ysjh.js";
export default {
  name: "ysjh",
  data() {
    return {
      // projectId: this.$route.params.projectId,

      // 用户导入参数
      upload: {
        open: false,
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/budget/importData",
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
        projectBudget: [
          { required: true, message: "请输入不含税预算(万)", trigger: "blur" }
        ],
        projectAmount: [
          { required: true, message: "请输入不含税发生额预算", trigger: "blur" }
        ],

        budgetRate: [
          { required: true, message: "请输入不含税发生额预算", trigger: "blur" }
        ],

        budgetMargin: [
          { required: true, message: "请输入预算差额", trigger: "blur" }
        ],

        budgetPercent: [
          { required: true, message: "请输入预算差额占比", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDict();
  },
  methods: {
    getList() {
      // this.queryParams.projectId = this.projectId;

      getYsjhList(this.queryParams).then(res => {
        this.tableData = res.rows;
      });
    },
    getDict() {
      // this.getDicts("liberary_type").then(res => {
      //   this.options.liberary_type = res.data;
      // });
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.getList();
    },
    handleAdd() {
      getProjectInfo(this.projectId).then(res => {
        this.form = res.data;
        this.form.projectId = this.form.id;
        delete this.form.id;
        this.dialogVisible = true;
        this.dialogTitle = "新增预算计划";
        this.isAdd = true;
        this.getList();
      });
    },
    handleUpdate() {
      this.dialogVisible = true;
      this.dialogTitle = "修改预算计划";
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
    handleFileUploadProgress() {
      this.upload.isUploading = true;
    },
    handelCancel() {
      this.dialogVisible = false;
      this.dialogTitle = "";
      this.form = {};
    },
    submitForm() {
      this.$refs.form.validate(value => {
        if (value) {
          addYsjhList(this.form).then(res => {
            this.handelCancel();
            this.getList();
            this.msgSuccess(res.msg);
          });
        }
      });
    },
    updateForm() {
      updateYsjhList(this.form).then(res => {
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
          return delYsjhList(this.ids);
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
    },
    handleImport() {
      this.upload.title = "预算计划导入";
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
      downloadYsjhDefault().then(res => {
        this.download(res.msg);
      });
    },
    submitFileForm() {
      this.$refs.upload.submit();
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
