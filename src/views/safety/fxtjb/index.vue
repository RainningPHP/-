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
        <div class="btn-group-single-title">风险等级</div>
        <el-input
          v-model="queryParams.risk_level"
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
        prop="oper_time"
        fixed
        label="导入时间"
        width="100"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="project_name"
        fixed
        label="项目名称"
        width="250"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="project_no"
        label="项目编号"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="work_type"
        label="作业类型"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="work_order"
        label="工序"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="risk_level"
        label="风险等级"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="work_position"
        label="作业部位"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="work_name"
        label="作业票名称"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="address"
        label="地理位置"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="start_time"
        label="计划开始时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="end_time"
        label="计划完成时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="start_time_real"
        label="实际开始时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="end_time_real"
        label="实际完成时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="gk_measure"
        label="管控措施"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="bc_measure"
        label="补充措施"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="lc_status"
        label="流程状态"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="oper_time"
        label="导入时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="risk_zy_count"
        label="风险作业人数"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="sg_dw"
        label="施工单位"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="sg_zrr"
        label="施工责任人"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="fb_dw"
        label="分包单位"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="fb_zrr"
        label="分包责任人"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="fzr"
        label="工作责任人"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="jl_name"
        label="到场监理"
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
<!--              {{ form.project_name }-->
            </el-form-item>
          </el-col>
<!--          <el-col :span="24">-->
<!--            <el-form-item label="项目编号">{{ form.project_no }}</el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="作业类型" prop="work_type">
              <el-input v-model="form.work_type" placeholder="请输入作业类型" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序" prop="work_order">
              <el-input v-model="form.work_order" placeholder="请输入工序" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险等级" prop="risk_level">
              <el-input v-model="form.risk_level" placeholder="请输入风险等级" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业部位" prop="work_position">
              <el-input
                v-model="form.work_position"
                placeholder="请输入作业部位"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业票名称" prop="work_name">
              <el-input
                v-model="form.work_name"
                placeholder="请输入作业票名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地理位置" prop="address">
              <el-input v-model="form.address" placeholder="请输入地理位置" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始时间" prop="start_time">
              <el-date-picker
                clearable
                size="small"
                v-model="form.start_time"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择计划开始时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划完成时间" prop="end_time">
              <el-date-picker
                clearable
                size="small"
                v-model="form.end_time"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择计划完成时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际开始时间" prop="start_time_real">
              <el-date-picker
                clearable
                size="small"
                v-model="form.start_time_real"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择实际开始时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际完成时间" prop="end_time_real">
              <el-date-picker
                clearable
                size="small"
                v-model="form.end_time_real"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择实际完成时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管控措施" prop="gk_measure">
              <el-input v-model="form.gk_measure" placeholder="请输入管控措施" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="补充措施" prop="bcMeasure">
              <el-input v-model="form.bc_measure" placeholder="请输入补充措施" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="流程状态" prop="lcStatus">
              <el-input v-model="form.lc_status" placeholder="请输入流程状态" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="导入时间" prop="oper_time">
              <el-date-picker
                clearable
                size="small"
                v-model="form.oper_time"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择导入时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="风险作业人数">
              <el-input
                v-model="form.risk_zy_count"
                placeholder="请输入风险作业人数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="施工单位">
              <el-input v-model="form.sg_dw" placeholder="请输入施工单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="施工责任人">
              <el-input v-model="form.sg_zrr" placeholder="请输入施工责任人" />
              {{ formDetail.sg_zrr }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分包单位">
              <el-input v-model="form.fb_dw" placeholder="请输入分包单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分包责任人">
              <el-input v-model="form.fb_zrr" placeholder="请输入分包责任人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作责任人">
              <el-input v-model="form.fzr" placeholder="请输入工作责任人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到场监理">
              <el-input
                v-model="form.jl_name"
                placeholder="请输入风险作业人数"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" type="primary" @click.once="submitForm"
          >确 定</el-button
        >
        <el-button v-else type="primary" @click.once="updateForm">确 定</el-button>
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

    <!-- 详情对话框 -->
    <el-dialog
      :title="dialogTitleDetail"
      :before-close="handelCancelDetail"
      :visible.sync="dialogVisibleDetail"
      width="60%"
      append-to-body
    >
      <el-form :model="formDetail" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="项目名称">{{
              formDetail.project_name
            }}</el-form-item>
          </el-col>
<!--          <el-col :span="24">-->
<!--            <el-form-item label="项目编号">{{-->
<!--              formDetail.project_no-->
<!--            }}</el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="作业类型">{{
              formDetail.work_type
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序">{{ formDetail.work_order }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险等级">{{
              formDetail.risk_level
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业部位">{{
              formDetail.work_position
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业票名称">{{
              formDetail.work_name
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地理位置">{{
              formDetail.address
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始时间">{{
              formDetail.start_time
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划完成时间">{{
              formDetail.end_time
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际开始时间">{{
              formDetail.start_time_real
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际完成时间">{{
              formDetail.end_time_real
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管控措施">{{
              formDetail.gk_measure
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="补充措施">{{
              formDetail.bc_measure
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="流程状态">{{
              formDetail.lc_status
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="导入时间">{{
              formDetail.oper_time
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险作业人数">{{
              formDetail.risk_zy_count
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="施工单位">{{ formDetail.sg_dw }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="施工责任人">{{
              formDetail.sg_zrr
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分包单位">{{ formDetail.fb_dw }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分包责任人">{{
              formDetail.fb_zrr
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作责任人">{{ formDetail.fzr }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到场监理">{{
              formDetail.jl_name
            }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
// import { getProjectInfo } from "@/api/project/project.js";
import {
  getList,
  updateList,
  addList,
  delList,
  downloadDefault,
  getProjectList
} from "@/api/safety/fxtjb.js";
export default {
  name: "fxtjb",
  data() {
    return {
      option: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
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
        url: window.baseUrl + '/admin/ProjectRisk/importData',
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
      this.dialogTitle = "新增风险";
      this.isAdd = true;
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.dialogTitle = "修改风险等级";
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
