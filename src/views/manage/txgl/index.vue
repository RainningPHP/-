<template>
  <div class="app-container">
    <div class="btn-group">
      <div class="btn-group-single">
        <div class="btn-group-single-title">类别</div>
        <el-select
          v-model="queryParams.txgl_type"
          placeholder="请选择类别"
          clearable
          size="small"
          @change="getLists"
        >
          <el-option label="施工管理" value="施工管理" />
          <el-option label="监理管理" value="监理管理" />
          <el-option label="设计管理" value="设计管理" />
        </el-select>
      </div>
    </div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <!-- <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button> -->
      </el-col>
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
      v-loading="loading"
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="txgl_type" label="类别" width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column
        prop="period"
        label="项目建设类别"
        :show-overflow-tooltip="true"
        :formatter="projectTypeFormat"
      ></el-table-column>
      <el-table-column prop="type" label="评价类别" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="content" label="评价内容" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="point" label="分值" width="50" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sort" label="排序" width="50" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="point_detail" label="评价标准" :show-overflow-tooltip="true"></el-table-column>
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
      width="60%"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="类别" prop="txglType">
              <el-select v-model="form.txgl_type" placeholder="请选择类别" size="small">
                <el-option label="施工管理" value="施工管理" />
                <el-option label="监理管理" value="监理管理" />
                <el-option label="设计管理" value="设计管理" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="建设类别" prop="period">
              <el-select v-model="form.period" placeholder="请选择项目建设类别">
                <el-option
                  v-for="item in options.projectTypeOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
              <!-- <el-input v-model="form.period" placeholder="请输入评分项目"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="评价类别" prop="type">
              <el-input v-model="form.type" placeholder="请输入评价类别" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="评价内容" prop="content">
              <el-input v-model="form.content" placeholder="请输入评价内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排序" prop="sort">
              <el-input v-model="form.sort" placeholder="请输入排序" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分值" prop="point">
              <el-input v-model="form.point" placeholder="请输入分值" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="评价标准" prop="pointDetail">
              <el-input v-model="form.point_detail" placeholder="请输入评价标准" type="textarea" rows="5" />
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
  getList,
  updateList,
  addList,
  delList,
  downloadDefault
} from "@/api/manage/txgl.js";
export default {
  name: "wzk",
  data() {
    return {
      // projectId: this.$route.params.projectId,
      // 用户导入参数
      loading: false,
      upload: {
        open: false,
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/peccancy/importData",
        // 上传的文件列表
        fileList: [],

        updateSupport: false
      },

      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        txglType: ""
      },
      form: {},
      tableData: [],
      options: {
        projectTypeOptions: []
      },
      dialogVisible: false,
      dialogVisibleDetail: false,
      dialogTitle: "",
      dialogTitleDetail: "",
      isAdd: false,
      ids: [],
      single: true,
      multiple: true,
      currentForm: {},
      formDetail: {},
      rules: {
        // txglType: [{ required: true, message: "请输入类别", trigger: "blur" }],
        // period: [{ required: true, message: "请输入类别", trigger: "blur" }],
        // type: [{ required: true, message: "请输入类别", trigger: "blur" }],
        // content: [{ required: true, message: "请输入类别", trigger: "blur" }],
        // sort: [{ required: true, message: "请输入类别", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getLists();
    this.getDict();
  },

  methods: {
    getLists() {
      this.loading = true;
      getList(this.queryParams).then(res => {
        this.tableData = res.data.data;
        this.total = res.data.total;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    getDict() {
      this.getDicts("project_type").then(response => {
        this.options.projectTypeOptions = response.data;
      });
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.getLists();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增违章库";
      this.isAdd = true;
    },
    handleUpdate() {
      this.dialogVisible = true;
      this.dialogTitle = "修改违章库";
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
    getDetail(row) {
      this.dialogVisibleDetail = true;
      this.dialogTitleDetail = "风险等级详情";
      this.formDetail = row;
    },
    handelCancelDetail() {
      this.dialogVisibleDetail = false;
      this.dialogTitleDetail = "";
      this.formDetail = {};
    },
    submitForm() {
      this.$refs.form.validate(value => {
        if (value) {
          addList(this.form).then(res => {
            this.handelCancel();
            this.getLists();
            this.msgSuccess(res.msg);
          });
        }
      });
    },
    updateForm() {
      updateList(this.form).then(res => {
        this.handelCancel();
        this.getLists();
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
          return delList(this.ids);
        })
        .then(() => {
          this.getLists();
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
      this.upload.title = "风险等级导入";
      this.upload.open = true;
    },
    // 文件上传
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getLists();
    },
    importTemplate() {
      downloadDefault().then(res => {
        this.download(res.msg);
      });
    },
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 任务组名字典翻译
    projectTypeFormat(row, column) {
      return this.selectDictLabel(
        this.options.projectTypeOptions,
        row.projectType
      );
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
