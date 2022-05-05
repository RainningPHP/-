<template>
  <div class="app-container">
    <div class="btn-group">
      <div class="btn-group-single">
        <div class="btn-group-single-title">导入日期</div>
        <el-date-picker
          clearable
          size="small"
          v-model="queryParams.oper_time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="导入日期"
          @change="getLists"
        ></el-date-picker>
      </div>
      <div class="btn-group-single">
        <div class="btn-group-single-title">作业票名称</div>
        <el-input
          v-model="queryParams.ticket_name"
          placeholder="风险等级"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="getLists"
        />
      </div>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="getLists"
        >搜索</el-button
      >
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置</el-button
      >
    </div>
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
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          >导入</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>-->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete()"
          >删除</el-button
        >
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
      <el-table-column type="selection" width="50" fixed align="center" />
      <el-table-column type="index" width="50" fixed align="center" />
      <el-table-column
        prop="project_name"
        fixed
        label="项目名称"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="construction_name"
        fixed
        label="工作地区"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="ticket_level"
        fixed
        label="作业票等级"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="danger_level"
        label="风险级别"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="ticket_position"
        label="作业部位"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="ticket_name"
        label="作业票名称"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="ticket_quantity"
        label="作业票人数"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="ticket_content"
        label="作业内容"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="begin_time"
        label="开始时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="end_time"
        label="结束时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="real_quantity"
        label="实际作业人数"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="ticket_man"
        label="负责人"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="ticket_state"
        label="作业状态"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="technical_plan_name"
        label="技术方案"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="dk_time"
        label="附件"
        :show-overflow-tooltip="true"
        width="200"
      >
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.file_path"
            placement="top"
          >
            <el-button size="mini" @click="handleDownload(scope.row)">{{
              scope.row.file_name | emplisisText
              }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            size="mini"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            type="text"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
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
      width="60%"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="项目名称">
              <el-select v-model="form.project_id" @change="selectChange" filterable placeholder="请选择项目">
                <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :label="item.project_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作地区" prop="work_type">
              <el-input v-model="form.construction_name" placeholder="请输入工作地区" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业票等级" prop="work_order">
              <el-input v-model="form.ticket_level" placeholder="请输入作业票等级" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险级别" prop="risk_level">
              <el-input v-model="form.danger_level" placeholder="请输入风险级别" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业部位" prop="work_position">
              <el-input
                v-model="form.ticket_position"
                placeholder="请输入作业部位"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业票名称" prop="ticket_name">
              <el-input v-model="form.ticket_name" placeholder="请输入作业票名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业票人数" prop="ticket_quantity">
              <el-input v-model="form.ticket_quantity" placeholder="请输入作业票人数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业内容" prop="ticket_content">
              <el-input v-model="form.ticket_content" placeholder="请输入作业内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="begin_time">
              <el-date-picker
                clearable
                size="small"
                v-model="form.begin_time"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择开始时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="end_time">
              <el-date-picker
                clearable
                size="small"
                v-model="form.end_time"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择结束时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="实际作业人数" prop="real_quantity">
              <el-input v-model="form.real_quantity" placeholder="请输入实际作业人数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="ticket_man">
              <el-input v-model="form.ticket_man" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业状态" prop="ticket_state">
              <el-input v-model="form.ticket_state" placeholder="请输入作业状态" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="技术方案">
              <el-input
                v-model="form.technical_plan_name"
                placeholder="请输入技术方案"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上传附件" prop="fileId">
              <el-upload
                ref="upload"
                :limit="1"
                :action="upload2.url"
                :headers="upload2.headers"
                :file-list="upload2.fileList"
                :on-progress="handleFileUploadProgress2"
                :on-success="handleFileSuccess2"
              >
                <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
                >
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" :loading="upload2.isUploading" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button v-else :loading="upload2.isUploading" type="primary" @click="updateForm">确 定</el-button>
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
<!--        <div class="el-upload__tip" slot="tip">-->
<!--          &lt;!&ndash; <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据 &ndash;&gt;-->
<!--          <el-link type="info" style="font-size: 12px" @click="importTemplate"-->
<!--            >下载模板</el-link-->
<!--          >-->
<!--        </div>-->
        <div class="el-upload__tip" style="color: red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { commonDownload } from "@/utils/index";
import { mapGetters } from 'vuex';
import {
  getList,
  updateList,
  addList,
  delList,
  downloadDefault,
  getProjectList
} from "@/api/safety/zyp.js";
export default {
  name: "fxtjb",
  data() {
    return {
      loading: false,
      // projectId: this.$route.params.projectId,
      // 用户导入参数
      upload: {
        open: false,
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        // headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: window.baseUrl + '/admin/ProjectTicket/importData',
        // 上传的文件列表
        fileList: [],
        updateSupport: false,
      },
      upload2: {
        open: false,
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        // headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: window.uploadUrl,
        // 上传的文件列表
        fileList: [],
        updateSupport: false,
      },
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      form: {},
      tableData: [],
      options: {},
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
        // projectBudget: [
        //   { required: true, message: "请输入不含税预算(万)", trigger: "blur" }
        // ],
      },
      projectList: []
    };
  },
  created() {
    this.getLists();
    this.getProject();
  },
  computed: {
    ...mapGetters(['roles', 'name'])
  },
  methods: {
    handleFileUploadProgress2() {
      this.upload2.isUploading = true;
    },
    handleFileSuccess2(response, file, fileList) {
      this.upload2.isUploading = false;
      this.$set(this.form, "file_id", response.data.file_id);
      let time = parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}");
      this.form.oper_time = time;
    },
    selectChange(val) {
      const item = this.projectList.filter(item => item.id === val)[0];
      if (item) {
        this.form.project_name = item.project_name;
        this.form.project_no = item.project_no;
      }
    },
    getLists() {
      this.loading = true;
      // this.queryParams.projectId = this.projectId;
      if (this.roles.indexOf('xmjl') !== -1) {
        this.queryParams.user_name = this.name;
      }
      getList(this.queryParams).then((res) => {
        this.tableData = res.data.data;
        this.total = res.data.total;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });

    },
    getProject() {
      // getProjectList
      let obj = {}
      if (this.roles.indexOf('xmjl') !== -1) {
        obj.user_name = this.name;
      }
      getProjectList(obj).then(res => {
        this.projectList = res.data;
      });
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.getLists();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增作业票";
      this.isAdd = true;
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.dialogTitle = "修改作业票";
      this.isAdd = false;
      this.form = row;
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
        this.ids = selection.map((item) => item.id);
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
      this.$refs.form.validate((value) => {
        if (value) {
          addList(this.form).then((res) => {
            this.handelCancel();
            this.getLists();
            this.msgSuccess(res.msg);
          });
        }
      });
    },
    updateForm() {
      updateList(this.form).then((res) => {
        this.handelCancel();
        this.getLists();
        this.msgSuccess(res.msg);
      });
    },
    // 删除
    handleDelete(row) {
      this.$confirm("是否确认删除数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then((res) => {
          if (row) {
            return delList([row.id]);
          } else {
            return delList(this.ids);
          }
        })
        .then(() => {
          this.getLists();
          this.msgSuccess("删除成功");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleDownload(row) {
      commonDownload(row.file_id);
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
      console.log(response, 8899);
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getLists();
    },
    importTemplate() {
      downloadDefault().then((res) => {
        this.download(res.msg);
      });
    },
    submitFileForm() {
      this.$refs.upload.submit();
    },
  },
  filters: {
    emplisisText(value) {
      if (value && value.length > 10) {
        return value.substring(0, 10) + "···";
      } else {
        return value;
      }
    },
  },
};
</script>
