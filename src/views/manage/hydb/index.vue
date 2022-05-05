<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
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
      </el-col>-->
    </el-row>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <!-- <el-table-column type="selection" width="50" align="center" /> -->
      <el-table-column prop="meetingName" label="会议名称" :show-overflow-tooltip="true"></el-table-column>
      <!-- <el-table-column prop="mattersName" label="待办事项" :show-overflow-tooltip="true"></el-table-column> -->
      <el-table-column prop="createUser" label="发起人" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="createDate" label="时间" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column
        prop="isDb"
        label="是否督办"
        :show-overflow-tooltip="true"
        :formatter="dbFormate"
      ></el-table-column>
      <el-table-column prop label="附件" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.fileName"
            placement="top"
            v-if="scope.row.fileName"
          >
            <el-button
              size="mini"
              @click="handleDownload(scope.row)"
            >{{scope.row.fileName | emplisisText}}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button size="mini" @click="showAppointTask(scope.row)">指派</el-button>
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
            <el-form-item label="会议名称" prop="meetingName">
              <el-input v-model="form.meetingName" placeholder="请输入会议名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-for="(domain, index) in form.mattersName"
              :label="'待办事项 ' + index"
              :key="'matters'+index"
              :prop="'mattersName.' + index + '.value'"
              :rules="{
                required: true, message: '待办不能为空', trigger: 'blur'
              }"
              class="form-item-edit"
            >
              <el-input v-model="domain.value"></el-input>
              <el-button @click.prevent="removeDomain(domain)">删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="addDomain">新增待办</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发起人" prop="createUser">
              <el-input v-model="form.createUser" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="时间" prop="createDate">
              <el-date-picker
                clearable
                size="small"
                v-model="form.createDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
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
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" type="primary" @click="submitForm" :loading="upload.isUploading">确 定</el-button>
        <el-button v-else type="primary" @click="updateForm" :loading="upload.isUploading">确 定</el-button>
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="uploadImport.title" :visible.sync="uploadImport.open" width="400px">
      <el-upload
        ref="uploadImport"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="uploadImport.headers"
        :action="uploadImport.url"
        :disabled="uploadImport.isUploading"
        :on-progress="handleFileUploadProgressImport"
        :on-success="handleFileSuccessImport"
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
        <el-button type="primary" @click="submitFileForm" :loading="uploadImport.isUploading">确 定</el-button>
        <el-button @click="uploadImport.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 指派任务对话框 -->
    <el-dialog
      :title="dialogTitleAppoint"
      :before-close="handelCancelAppoint"
      :visible.sync="dialogVisibleAppoint"
      width="60%"
      append-to-body
      custom-class="appoint-content"
    >
      <el-row :gutter="20">
        <el-col :span="14" class="appoint-left">
          <div
            class="appoint-left-single"
            v-for="(domain, index) in appointData.mattersList"
            :label="'待办事项 ' + index"
            :key="'apmatters'+index"
          >
            <span>{{index + 1}}、{{domain.mattersName}}</span>
            <div>
              <el-button
                v-if="domain.dbId"
                @click.prevent="appointTaskManager(domain,index)"
                disabled
              >已指派</el-button>

              <el-button type="primary" v-else @click.prevent="appointTaskManager(domain,index)">指派</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="10" class="appoint-right">
          <div style="height:100%" v-show="isAppointting">
            <div class="appoint-right-title">待办事项{{currentAppointData.index + 1}} 指派</div>
            <el-scrollbar style="height: calc(100% - 80px)">
              <el-checkbox-group v-model="currentAppointData.selectedManager">
                <el-checkbox
                  v-for="manager in appointData.managerList"
                  :label="manager.nickName"
                  :key="manager.userName"
                >
                  <p>{{manager.nickName}}</p>
                </el-checkbox>
              </el-checkbox-group>
            </el-scrollbar>
            <div class="el-button-group-bottom">
              <el-button type="primary" @click="appointTask">确 定</el-button>
              <el-button @click="handelCancelAppoint2">取 消</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- <div slot="footer" class="dialog-footer">
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";
import { deepClone } from "@/utils/index";
import { getToken } from "@/utils/auth";
// import { getProjectInfo } from "@/api/project/project.js";
import {
  getHydbMeetingList,
  getHydbTaskList,
  updateHydbList,
  addHydbList,
  delHydbList,
  downloadHydbDefault,
  getManagerList,
  addDb
} from "@/api/manage/hydb.js";
export default {
  name: "hydb",
  data() {
    return {
      // projectId: this.$route.params.projectId,

      // 用户导入参数
      uploadImport: {
        open: false,
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/meetingTask/importData",
        // 上传的文件列表
        fileList: [],

        updateSupport: false
      },
      // 上传附件参数
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
        pageNum: 1,
        pageSize: 10
      },
      //本地子任务mattersName: [{ value: "" }]
      // 上传转化格式，并制空
      // mattersList:[{''}]
      form: { mattersName: [{ value: "" }] },
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
        meetingName: [
          { required: true, message: "请填写会议名称", trigger: "blur" }
        ],
        createUser: [
          { required: true, message: "请填写发起人", trigger: "blur" }
        ],
        createDate: [
          { required: true, message: "请选择时间", trigger: "change" }
        ]
      },
      // 指派
      // 指派弹窗
      dialogTitleAppoint: "",
      // 指派右侧人员列表
      dialogVisibleAppoint: false,
      // 指派弹窗显示数据
      appointData: {
        managerList: [],
        mattersList: []
      },
      // 当前选中指派数据
      currentAppointData: {
        task: {},
        selectedManager: []
      },
      // 人员列表是否显示
      isAppointting: false
    };
  },
  created() {
    this.getList();
    this.getDict();
  },
  methods: {
    // 获取会议列表
    getList() {
      getHydbMeetingList(this.queryParams).then(res => {
        this.tableData = res.meetingList;
      });
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.getList();
    },
    // 打开新增弹窗
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增会议";
      this.isAdd = true;
    },
    // 打开修改弹窗

    handleUpdate() {
      this.dialogVisible = true;
      this.dialogTitle = "修改会议";
      this.isAdd = false;
      this.form = this.currentForm;
      getHydbTaskList({ meetingName: this.form.meetingName }).then(res => {
        let mattersList = res.rows;
        this.$set(
          this.form,
          "mattersName",
          mattersList.map(item => {
            return { value: item.mattersName };
          })
        );
      });
    },
    // 选择
    handleSelectionChange(selection) {
      this.single = selection.length !== 1;
      if (this.single) {
        this.currentForm = {
          mattersName: [{ value: "" }]
        };
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

    // 编辑正在上传
    handleFileUploadProgress() {
      this.upload.isUploading = true;
    },

    // 上传成功
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      this.$set(this.form, "fileId", response.fileId);
      this.form.projectId = this.projectId;
      let time = parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}");
      this.form.operTime = time;
    },
    // 关闭新增修改弹窗
    handelCancel() {
      this.dialogVisible = false;
      this.dialogTitle = "";
      this.$refs.form.resetFields();
      this.form = {
        mattersName: [{ value: "" }]
      };
      this.$refs.upload.clearFiles();
    },
    // 新增提交
    submitForm() {
      let formSubmit = deepClone(this.form);
      formSubmit.mattersList = this.form.mattersName.map(item => item.value);
      formSubmit.mattersName = "";
      this.$refs.form.validate(value => {
        if (value) {
          addHydbList(formSubmit).then(res => {
            this.handelCancel();
            this.getList();
            this.msgSuccess(res.msg);
          });
        }
      });
    },
    // 修改提交
    updateForm() {
      updateHydbList(this.form).then(res => {
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
          return delHydbList(this.ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 下载
    handleDownload(row) {
      this.download(row.fileName);
    },
    // 打开导入弹窗
    handleImport() {
      this.uploadImport.title = "会议督办导入";
      this.uploadImport.open = true;
    },
    // 文件上传
    handleFileSuccessImport(response, file, fileList) {
      this.uploadImport.open = false;
      this.uploadImport.isUploading = false;
      this.$refs.uploadImport.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 下载模板
    importTemplate() {
      downloadHydbDefault().then(res => {
        this.download(res.msg);
      });
    },
    // 导入正在上传
    handleFileUploadProgressImport() {
      this.uploadImport.isUploading = true;
    },
    // 提交导入
    submitFileForm() {
      this.$refs.uploadImport.submit();
    },

    // 子任务删除
    removeDomain(item) {
      var index = this.form.mattersName.indexOf(item);
      if (index !== -1) {
        this.form.mattersName.splice(index, 1);
      }
    },
    // 子任务添加
    addDomain() {
      this.form.mattersName.push({
        value: ""
      });
    },
    // 关闭指派弹窗
    handelCancelAppoint() {
      this.dialogVisibleAppoint = false;
      this.dialogTitleAppoint = "";
      this.appointData = {};
      this.handelCancelAppoint2();
    },
    // 关闭弹窗右侧指派
    handelCancelAppoint2() {
      this.isAppointting = false;
      this.currentAppointData = {
        selectedManager: []
      };
    },
    // 获取子任务（meetingName）
    getHydbTaskLists(data) {
      let params = {};
      if (data) params = data;
      getHydbTaskList(params).then(res => {
        this.$set(this.appointData, "mattersList", res.rows);
      });
    },
    // 打开指派 弹窗
    showAppointTask(row) {
      this.dialogVisibleAppoint = true;
      this.dialogTitleAppoint = row.meetingName;
      getManagerList().then(res => {
        this.$set(this.appointData, "managerList", res.rows);
      });
      this.getHydbTaskLists({ meetingName: row.meetingName });
    },
    // 打开指派右侧管理人员列表
    appointTaskManager(matter, index) {
      this.isAppointting = false;
      setTimeout(() => {
        this.isAppointting = true;
      }, 100);
      this.currentAppointData.selectedManager = [];
      this.currentAppointData.task = matter;
      this.currentAppointData.index = index;
    },
    // 指派任务
    appointTask() {
      addDb({
        meetingName: this.currentAppointData.task.meetingName,
        mattersName: this.currentAppointData.task.mattersName,
        receiveUser: this.currentAppointData.selectedManager.join(",")
      })
        .then(res => {
          return new Promise((resolve, reject) => {
            resolve(res.dbId);
          });
        })
        .then(dbId => {
          return new Promise((resolve, reject) => {
            updateHydbList({
              id: this.currentAppointData.task.id,
              dbId: dbId
            }).then(res => {
              this.$message.success("指派成功");
              resolve();
            });
          });
        })
        .then(res => {
          return new Promise((resolve, reject) => {
            this.getHydbTaskLists({
              meetingName: this.currentAppointData.task.meetingName
            });
            resolve();
          });
        })
        .then(res => {
          this.handelCancelAppoint2();
        });
    },
    // 督办状态格式化
    dbFormate(row) {
      let map = {
        1: "未督办",
        2: "已督办"
      };
      return map[Number(row.isDb)];
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
<style lang="scss" scoped>
::v-deep .appoint {
  &-content {
    height: 80%;
    .el-dialog__body {
      height: calc(100% - 54px);
      .el-row {
        height: 100%;
      }
    }
    .el-scrollbar__wrap {
      overflow-x: auto;
    }
  }

  &-left {
    height: 100%;
    border-right: 1px solid #eee;
    &-single {
      height: 60px;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
    }
  }

  &-right {
    height: 100%;
    &-title {
      font-size: 18px;
      line-height: 40px;
      text-align: center;
    }
  }
}
.el-button-group-bottom {
  display: flex;
  justify-content: flex-end;
}
</style>