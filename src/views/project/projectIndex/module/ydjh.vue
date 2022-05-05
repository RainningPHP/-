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
        prop="jhTime"
        label="时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="jsxt"
        label="建设协调"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="aqzl"
        label="安全质量"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="dagk"
        label="档案管控"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="bdWz"
        label="变电物资"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="bdSj"
        label="变电设计"
        :show-overflow-tooltip="true"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="bdJl"
        label="变电监理"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="bdSg"
        label="变电施工"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="xlWz"
        label="线路物资"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="xlSj"
        label="线路设计"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="xlJl"
        label="线路监理"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="xlSg"
        label="线路施工"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="txWz"
        label="通信物资"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="txSj"
        label="通信设计"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="txSg"
        label="通信施工"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="项目名称">
              {{ form.projectName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间" prop="jhTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.jhTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建设协调" prop="jsxt">
              <el-input v-model="form.jsxt" placeholder="请输入建设协调" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安全质量" prop="aqzl">
              <el-input v-model="form.aqzl" placeholder="请输入安全质量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="档案管控" prop="dagk">
              <el-input v-model="form.dagk" placeholder="请输入档案管控" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变电物资" prop="bdWz">
              <el-input v-model="form.bdWz" placeholder="请输入变电物资" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变电设计" prop="bdSj">
              <el-input v-model="form.bdSj" placeholder="请输入变电设计" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变电监理" prop="bdJl">
              <el-input v-model="form.bdJl" placeholder="请输入变电监理" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变电施工" prop="bdSg">
              <el-input v-model="form.bdSg" placeholder="请输入变电施工" />
            </el-form-item> </el-col
          ><el-col :span="12">
            <el-form-item label="线路物资" prop="xlWz">
              <el-input v-model="form.xlWz" placeholder="请输入线路物资" />
            </el-form-item> </el-col
          ><el-col :span="12">
            <el-form-item label="线路设计" prop="xlSj">
              <el-input v-model="form.xlSj" placeholder="请输入线路设计" />
            </el-form-item> </el-col
          ><el-col :span="12">
            <el-form-item label="线路监理" prop="xlJl">
              <el-input v-model="form.xlJl" placeholder="请输入线路监理" />
            </el-form-item> </el-col
          ><el-col :span="12">
            <el-form-item label="线路施工" prop="xlSg">
              <el-input v-model="form.xlSg" placeholder="请输入线路施工" />
            </el-form-item> </el-col
          ><el-col :span="12">
            <el-form-item label="通信物资" prop="txWz">
              <el-input v-model="form.txWz" placeholder="请输入通信物资" />
            </el-form-item> </el-col
          ><el-col :span="12">
            <el-form-item label="通信设计" prop="txSj">
              <el-input v-model="form.txSj" placeholder="请输入通信设计" />
            </el-form-item> </el-col
          ><el-col :span="12">
            <el-form-item label="通信施工" prop="txSg">
              <el-input v-model="form.txSg" placeholder="请输入通信施工" />
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
        :data="{ projectId, updateSupport: upload.updateSupport }"
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
} from "@/api/progress/ydjh.js";
export default {
  name: "ydjh",
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
        url: process.env.VUE_APP_BASE_API + "/system/ydjh/importData",
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
      this.dialogTitle = "新增月度计划";
      this.isAdd = true;
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.dialogTitle = "修改月度计划";
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
            console.log(222);

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
      this.upload.title = "月度计划导入";
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