<template>
  <div>
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
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          >导入</el-button
        >
      </el-col>
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
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >修改</el-button
        >
      </el-col>
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
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          :loading="exportLoading"-->
<!--          @click="handleExport"-->
<!--          >导出</el-button-->
<!--        >-->
<!--      </el-col>-->
    </el-row>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      v-loading="loading"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        type="index"
        fixed
        width="50"
        align="center"
        :index="indexMethod"
      />
      <el-table-column
        prop="p_name"
        fixed
        width="250"
        label="输变电工程名称"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="project_name"
        fixed
        width="250"
        label="项目名称"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="sb_name"
        label="停电设备"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="start_date"
        label="开始时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="end_date"
        label="结束时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="td_day"
        label="停电天数"
        :show-overflow-tooltip="true"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="work_detail"
        label="工作内容"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="gc_fl"
        label="工程分类"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="gc_xz"
        label="工程性质"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="sb_type"
        label="停电设备类型"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="work_dw"
        label="工作单位"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="xg_jl"
        label="修改记录"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="xtc_yj"
        label="系统处意见"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="gx_reason"
        label="更新原因"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="factory_stations"
        label="厂站"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="is_high_risk"
        label="是否为五级电网事件风险"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="risk_desc"
        label="五级电网事件风险描述"
        :show-overflow-tooltip="true"
      ></el-table-column>
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
          <el-button
            type="text"
            icon="el-icon-plus"
            size="mini"
            @click="handrecord(scope.row)"
            >记录</el-button
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

    <!-- 修改记录对话框 -->
    <el-dialog
      :title="dialogTitle"
      :before-close="handelCancel"
      :visible.sync="dialogVisible"
      width="60%"
      append-to-body

    >
    </el-dialog>

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
            <el-form-item label="输变电工程名称">
              <el-select v-model="form.p_id" @change="selectChange" filterable placeholder="请选择输变电">
                <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :label="item.project_name"
                  :value="item.id">
                </el-option>
              </el-select>
              <!--              {{ form.project_name }-->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目名称">
              <el-select v-loading="selectLoading" v-model="form.project_id" @change="selectChangeSub" filterable placeholder="请选择项目">
                <el-option
                  v-for="item in projectSubList"
                  :key="item.id"
                  :label="item.project_name"
                  :value="item.id">
                </el-option>
              </el-select>
              <!--              {{ form.project_name }-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停电设备" prop="sb_name">
              <el-input v-model="form.sb_name" placeholder="请输入停电设备" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="start_date">
              <el-date-picker
                clearable
                size="small"
                v-model="form.start_date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择开始时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="end_date">
              <el-date-picker
                clearable
                size="small"
                v-model="form.end_date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择结束时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="停电天数" prop="td_day">
              <el-input v-model="form.td_day" placeholder="请输入停电天数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作内容" prop="work_detail">
              <el-input
                v-model="form.work_detail"
                placeholder="请输入工作内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程分类" prop="gc_fl">
              <el-input v-model="form.gc_fl" placeholder="请输入工程分类" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程性质" prop="gc_xz">
              <el-input v-model="form.gc_xz" placeholder="请输入工程性质" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停电设备类型" prop="sb_type">
              <el-input
                v-model="form.sb_type"
                placeholder="请输入停电设备类型"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作单位" prop="work_dw">
              <el-input v-model="form.work_dw" placeholder="请输入工作单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修改记录" prop="xg_jl">
              <el-input v-model="form.xg_jl" placeholder="请输入修改记录" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统处意见" prop="xtc_yj">
              <el-input v-model="form.xtc_yj" placeholder="请输入系统处意见" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新原因" prop="gx_reason">
              <el-input v-model="form.gx_reason" placeholder="请输入更新原因" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厂站" prop="factory_stations">
              <el-input v-model="form.factory_stations" placeholder="请输入厂站" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否为五级电网事件风险" prop="is_high_risk">
              <el-radio-group v-model="form.is_high_risk">
                <el-radio label="是" value="是"></el-radio>
                <el-radio label="否" value="否"></el-radio>
              </el-radio-group>

            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="五级电网事件风险描述" prop="risk_desc">
              <el-input type="textarea" v-model="form.risk_desc" placeholder="请输入五级电网事件风险描述" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" type="primary" @click="submitForm"
          >确 定</el-button
        >
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
          <el-link type="info" style="font-size: 12px" @click="importTemplate"
            >下载模板</el-link
          >
        </div>
        <div class="el-upload__tip" style="color: red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.once="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
import {
  getList,
  downloadDefault,
  delList,
  addList,
  updateList,
  exportList,
  getProjects
} from "@/api/progress/tdjh.js";
export default {
  name: "tdjh",
  data() {
    return {
      selectLoading: false,
      loading: false,
      projectList: [],
      projectSubList: [],
      link_project_id: false,
      projectId: this.$route.params.projectId,
      // 用户导入参数
      upload: {
        open: false,
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        // headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        // url: process.env.VUE_APP_BASE_API + "/system/td/importData_new",
        url: window.baseUrl + '/admin/ProjectPower/importData',
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
      dialogTitle: "",
      isAdd: false,
      ids: [],
      single: true,
      multiple: true,
      currentForm: {},
      rules: {
        projectBudget: [
          { required: true, message: "请输入不含税预算(万)", trigger: "blur" },
        ],
      },
      exportLoading: false,
    };
  },
  created() {
    this.getLists();
    this.getProject('projectList', false, 3);
  },
  methods: {
    selectChange(val) {
      const item = this.projectList.filter(item => item.id === val)[0];
      if (item) {
        delete this.form.project_id;
        delete this.form.project_name;
        this.form.p_name = item.project_name;
        this.form.p_id = item.id;
        this.link_project_id = item.id;
        this.projectSubList = [];
        this.getProject('projectSubList', item.id, '');
      }
    },
    selectChangeSub(val) {
      const item = this.projectSubList.filter(item => item.id === val)[0];
      if (item) {
        this.form.project_name = item.project_name;
        this.form.project_id = item.id;
      }
    },
    getProject(type = 'projectList', link_project_id, project_type) {
      // getProjectList
      let parmas = {}
      if (project_type) parmas.project_type = project_type;
      if (link_project_id) parmas.link_project_id = link_project_id;
      this.selectLoading = true;
      getProjects(parmas).then(res => {
        this[type] = res.data;
        this.selectLoading = false;
      }).catch(() => {
        this.selectLoading = false;
      });
    },
    getLists() {
      this.loading = true;
      getList(this.queryParams).then((res) => {
        this.tableData = res.data.data;
        this.total = res.data.total;
        this.loading = false
      }).catch(() => {
        this.loading = false;
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
      this.getLists();
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.getLists();
    },
    // 多选
    handleSelectionChange(selection) {
      this.multiple = !selection.length;
      this.single = selection.length != 1;
      this.ids = selection.map((item) => item.id);
      if (this.single) {
        this.currentForm = {};
      } else {
        this.currentForm = selection[0];
      }
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    importTemplate() {
      downloadDefault().then((res) => {
        this.download(res.msg);
      });
    },
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 删除
    handleDelete(row) {
      this.$confirm("是否确认删除数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
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
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增停电计划";
      this.isAdd = true;
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.dialogTitle = "修改停电计划";
      this.isAdd = false;
      this.form = row;
      this.getProject('projectSubList', row.p_id, '');
    },
    handrecord(row) {
      this.dialogVisible = true;
      this.dialogTitle = "添加记录";
      this.isAdd = true;
      this.form = row;
    },
    handelCancel() {
      this.dialogVisible = false;
      this.dialogTitle = "";
      this.form = {};
    },
    submitForm() {
      this.$refs.form.validate((value) => {
        if (value) {
          this.form.projectId = this.projectId;
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
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有参数数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportList(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    indexMethod(index) {
      return (this.queryParams.pageNum - 1) * 10 + index + 1;
    },
  },
};
</script>

<style  lang="scss">
.el-tooltip__popper.is-dark {
  max-width: 80%;
}
</style>
