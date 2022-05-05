<template>
  <div class="app-container">
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          >导出</el-button
        >
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
      <el-table-column
        type="index"
        fixed
        width="50"
        align="center"
        :index="indexMethod"
      />
      <el-table-column
        prop="projectName"
        fixed
        width="250"
        label="项目名称"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="startTno"
        label="跨越段起点杆塔号"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="endTno"
        label="跨越段终点杆塔号"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="obstacle"
        label="跨越物"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="approveTime"
        label="跨越物主管单位许可或批准完成时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="aqpgTime"
        label="安全评估文件完成时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="obstaclePs"
        label="跨越方案评审"
        :show-overflow-tooltip="true"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="sgxk"
        label="施工许可及安全协议案例"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="kycksq"
        label="跨越窗口申请"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="zrrName"
        label="属地工作责任人"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="linkPhone"
        label="责任人联系方式"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="sgDw"
        label="施工单位责任及联系方式"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
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
      width="80%"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="项目名称">
              {{ form.projectName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="跨越段起点杆塔号" prop="startTno">
              <el-input
                v-model="form.startTno"
                placeholder="请输入跨越段起点杆塔号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="跨越段终点杆塔号" prop="endTno">
              <el-input
                v-model="form.endTno"
                placeholder="请输入跨越段终点杆塔号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="跨越物主管单位许可或批准完成时间"
              prop="approveTime"
            >
              <el-date-picker
                clearable
                size="small"
                v-model="form.approveTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择跨越物主管单位许可或批准完成时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安全评估文件完成时间" prop="aqpgTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.aqpgTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择安全评估文件完成时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="跨越方案评审" prop="obstaclePs">
              <el-input
                v-model="form.obstaclePs"
                placeholder="请输入跨越方案评审"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="施工许可及安全协议案例" prop="sgxk">
              <el-input
                v-model="form.sgxk"
                placeholder="请输入施工许可及安全协议案例"
              />
            </el-form-item> </el-col
          ><el-col :span="12">
            <el-form-item label="跨越窗口申请" prop="kycksq">
              <el-input
                v-model="form.kycksq"
                placeholder="请输入跨越窗口申请"
              />
            </el-form-item> </el-col
          ><el-col :span="12">
            <el-form-item label="属地工作责任人" prop="zrrName">
              <el-input
                v-model="form.zrrName"
                placeholder="请输入属地工作责任人"
              />
            </el-form-item> </el-col
          ><el-col :span="12">
            <el-form-item label="责任人联系方式" prop="linkPhone">
              <el-input
                v-model="form.linkPhone"
                placeholder="请输入责任人联系方式"
              />
            </el-form-item> </el-col
          ><el-col :span="12">
            <el-form-item label="施工单位责任及联系方式" prop="sgDw">
              <el-input
                v-model="form.sgDw"
                placeholder="请输入施工单位责任及联系方式"
              />
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
        :data="{ projectId, updateSupport: upload.updateSupport }"
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
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
import { getProjectInfo } from "@/api/project/project.js";
import {
  getList,
  delList,
  addList,
  updateList,
  downloadDefault,
  exportList,
} from "@/api/progress/kygz.js";
export default {
  name: "kygz",
  data() {
    return {
      projectId: this.$route.params.projectId,

      // 用户导入参数
      upload: {
        open: false,
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/gcky/importData",
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
    this.getDict();
  },
  methods: {
    getLists() {
      this.queryParams.projectId = this.projectId;

      getList(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    getDict() {
      // this.getDicts("liberary_type").then(res => {
      //   this.options.liberary_type = res.data;
      // });
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.getLists();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增跨越工作";
      this.isAdd = true;
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.dialogTitle = "修改跨越工作";
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
    handleDownload(row) {
      this.download(row.fileName);
    },
    handleImport() {
      this.upload.title = "跨越工作导入";
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
      downloadDefault().then((res) => {
        this.download(res.msg);
      });
    },
    submitFileForm() {
      this.$refs.upload.submit();
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