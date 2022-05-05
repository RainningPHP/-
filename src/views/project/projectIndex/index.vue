<template>
  <div class="app-container">
    <div class="btn-group">
      <div class="btn-group-single">
        <div class="btn-group-single-title">项目名称</div>
        <el-input
          v-model="queryParams.projectName"
          placeholder="项目名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="getList"
        />
      </div>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="getList"
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
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete()"
        >删除</el-button>
      </el-col>-->
    </el-row>
    <el-table
      ref="projectlist"
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :load="loadChildrenList"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="projectName" label="项目名称"></el-table-column>
      <el-table-column prop="projectNo" label="项目编号"></el-table-column>
      <el-table-column
        prop="projectType"
        label="项目建设类别"
        width="150"
        :formatter="projectTypeFormat"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editProject(scope.row)"
            >编辑</el-button
          >
          <template v-if="scope.row.isParent">
            <el-button size="mini" @click="getDetail(scope.row)"
              >详情</el-button
            >
            <el-button size="mini" @click="showBanner(scope.$index, scope.row)"
            >轮播</el-button
            >
            <el-button
              v-if="scope.row.isParent && permission !== 'xmjl'"
              size="mini"
              @click="assignManager(scope.$index, scope.row)"
              >指派项目经理</el-button
            >
          </template>

          <template v-else>
            <el-popover
              placement="top"
              width="500"
              trigger="click"
              style="margin-left: 10px"
            >
              <div class="popoverModule">
                <el-button
                  v-for="item in Object.keys(options.documentMap)"
                  :key="item.id"
                  slot="reference"
                  type="primary"
                  size="mini"
                  min-width="25%"
                  @click="jumpToManage(item, scope.row)"
                  >{{ item }}</el-button
                >
              </div>
              <el-button slot="reference" size="mini">上传基础文件</el-button>
            </el-popover>
          </template>
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
    <!-- 轮播图修改 -->
    <el-dialog
      title="轮播图"
      :visible.sync="dialogVisibleBanner"
      width="50%"
      :before-close="handleCloseBanner"
    >
      <el-upload
        ref="upload"
        list-type="picture"
        :action="upload.url"
        :headers="upload.headers"
        :file-list="upload.fileList"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess">
        <el-button size="small" type="primary">点击上传</el-button>
<!--        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseBanner">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 指派经理对话框 -->
    <el-dialog
      title="指派项目经理"
      :visible.sync="dialogVisibleManager"
      width="50%"
      :before-close="handleCloseManager"
    >
      <el-transfer
        ref="manageSelect"
        :titles="['项目经理', '已选中项目经理']"
        v-model="multipleSelection"
        :data="userListData"
        :props="{
          key: 'userName',
          label: 'nickName',
        }"
      ></el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseManager">取 消</el-button>
        <el-button type="primary" @click="submitManager">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加修改项目对话框 -->
    <el-dialog
      :title="dialogTitle"
      :before-close="cancelProject"
      :visible.sync="dialogVisibleProject"
      width="80%"
      append-to-body
    >
      <el-form
        ref="projectForm"
        :model="projectForm"
        :rules="rules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                v-model="projectForm.projectName"
                placeholder="请输入项目名称"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="项目编号" prop="projectNo">
              <el-input
                v-model="projectForm.projectNo"
                placeholder="请输入项目编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目建设类别" prop="projectType">
              <el-select
                v-model="projectForm.projectType"
                placeholder="请选择项目建设类别"
              >
                <el-option
                  v-for="item in options.projectTypeOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建设单位名称" prop="jsDw">
              <el-input
                v-model="projectForm.jsDw"
                placeholder="请输入建设单位名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市" prop="city">
              <el-input v-model="projectForm.city" placeholder="请输入城市" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目性质" prop="projectXz">
              <el-input
                v-model="projectForm.projectXz"
                placeholder="请输入项目性质"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总投资" prop="projectTz">
              <el-input
                v-model="projectForm.projectTz"
                placeholder="请输入总投资"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电压等级" prop="projectDyLevel">
              <el-input
                v-model="projectForm.projectDyLevel"
                placeholder="请输入电压等级"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目规模(电力)" prop="projectScale1">
              <el-input
                v-model="projectForm.projectScale1"
                placeholder="请输入项目规模"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目规模(线路)" prop="projectScale2">
              <el-input
                v-model="projectForm.projectScale2"
                placeholder="请输入项目规模2"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="单项工程类型" prop="projectDxgcType">
              <el-select
                v-model="projectForm.projectDxgcType"
                placeholder="请选择单项工程类型"
              >
                <el-option
                  v-for="item in options.projectDxgcTypeOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目进展阶段 " prop="projectPeriod">
              <el-select
                v-model="projectForm.projectPeriod"
                placeholder="请选择项目进展阶段"
              >
                <el-option
                  v-for="item in options.project_period"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开工时间" prop="kgTime">
              <el-date-picker
                clearable
                size="small"
                v-model="projectForm.kgTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择开工时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="投产时间" prop="tcTime">
              <el-date-picker
                clearable
                size="small"
                v-model="projectForm.tcTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择投产时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实际开工时间" prop="kgTimeReal">
              <el-date-picker
                clearable
                size="small"
                v-model="projectForm.kgTimeReal"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择开工时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实际投产时间" prop="tcTimeReal">
              <el-date-picker
                clearable
                size="small"
                v-model="projectForm.tcTimeReal"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择实际投产时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="里程碑时间" prop="overTime">
              <el-date-picker
                clearable
                size="small"
                v-model="projectForm.overTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择里程碑时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="内控开通时间" prop="internal_control_start_time">
              <el-date-picker
                clearable
                size="small"
                v-model="projectForm.internal_control_start_time"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="内控开通时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="内控投产时间" prop="internal_control_prod_time">
              <el-date-picker
                clearable
                size="small"
                v-model="projectForm.internal_control_prod_time"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="内控投产时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="地址" prop="xmbAddress">
              <!-- <el-input v-model="projectForm.address"></el-input> -->
              <select-address
                @changeAdd="changeAddress"
                :address.sync="projectForm.xmbAddress"
                :lng.sync="projectForm.longitude"
                :lat.sync="projectForm.latitude"
              ></select-address>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="是否是主项目" prop="isParent">
              <el-radio-group v-model="projectForm.isParent">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="选择主项目"
              prop="linkProjectId"
              v-if="projectForm.isParent"
            >
              <el-select
                v-model="projectForm.linkProjectId"
                placeholder="选择主项目"
              >
                <el-option
                  v-for="item in options.linkProjectOptions"
                  :key="item.id"
                  :label="item.projectName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitProjectFormEdit"
          v-if="isEdit"
          :loading="loading"
          >确 定</el-button
        >
        <el-button
          type="primary"
          @click="submitProjectForm"
          v-else
          :loading="loading"
          >确 定</el-button
        >
        <el-button @click="cancelProject">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  // addProject,
  // updateProject,
  getUserList,
  updateUserList,
  getInfoByLoginUser,
  getChildrenProject,
  // getProjectInfo,
} from "@/api/project/project.js";
import {
  addProject,
  updateProject,
  getProjectInfo,
  addBanner,
  bannerList
} from "@/api/project/project_php.js";
import { getRolePermession } from "@/api/login.js";
import { mapGetters } from "vuex";
import SelectAddress from "@/components/Map/AMap/SelectAddress.vue";
export default {
  name: "projectlist",
  components: { SelectAddress },
  data() {
    let addressValid = (rule, value, callback) => {
      if (!this.projectForm.xmbAddress) {
        return callback("请选择选择地址");
      } else {
        return callback();
      }
    };
    return {
      upload: {
        open: false,
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer "},
        // 上传的地址
        url: window.uploadUrl,
        // 上传的文件列表
        fileList: [],
        updateSupport: false,
      },
      // 轮播
      dialogVisibleBanner: false,
      // 指派项目负责人弹窗
      dialogVisibleManager: false,
      // 添加项目弹窗
      dialogVisibleProject: false,
      // 列表数据
      tableData: [],
      queryParams: {
        pageSize: 10,
        pageNum: 1,
      },
      total: 0,
      // 新增弹窗表单
      projectForm: {},
      dialogTitle: "",
      rules: {
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
        ],
        projectNo: [
          { required: true, message: "请输入项目编号", trigger: "blur" },
        ],
        projectType: [
          { required: true, message: "请选择项目建设类别", trigger: "change" },
        ],
        // projectDyLevel: [
        //   { required: true, message: "请输入电压等级", trigger: "blur" }
        // ],
        // projectScale1: [
        //   { required: true, message: "请输入项目规模(电力)", trigger: "blur" }
        // ],
        // projectScale2: [
        //   { required: true, message: "请输入项目规模(电力)", trigger: "blur" }
        // ],
        // projectDxgcType: [
        //   { required: false, message: "请选择单项工程类型", trigger: "change" }
        // ],
        // overTime: [
        //   { required: true, message: "请选择里程碑时间", trigger: "change" }
        // ],
        // xmbAddress: [
        //   { required: true, validator: addressValid, trigger: "blur" }
        // ],
        isParent: [
          { required: true, message: "请选择是否是主项目", trigger: "change" },
        ],
        linkProjectId: [
          { required: true, message: "请选择选择主项目", trigger: "change" },
        ],
      },
      options: {
        projectTypeOptions: [],
        projectDxgcTypeOptions: [],
        linkProjectOptions: [],
        documentMap: {
          可研评审: "kyps",
          项目核准: "xmhz",
          支撑性文件: "zcxwj",
          初步设计: "cbsj",
        },
      },
      // 指派项目负责人
      userListData: [],
      // 当前选中
      multipleSelection: [],
      // 当前弹窗项目id
      currentProjectID: "",
      defaultManager: [],
      permission: "",
      currentLinkID: "",
      childrenMap: new Map(),
      // 编辑
      currentProjectIdEdit: "",
      isEdit: false,
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["name", "moduleMap"]),
  },
  created() {
    this.getList();
    this.getUserlist();
    this.getDicts("project_type").then((response) => {
      this.options.projectTypeOptions = response.data;
    });
    this.getDicts("project_dxgc_type").then((response) => {
      this.options.projectDxgcTypeOptions = response.data;
    });
    this.getDicts("project_period").then((res) => {
      this.options.project_period = res.data;
    });
  },
  methods: {
    // 获取列表(包含权限)
    getList: async function () {
      if (!this.permission) {
        let permissionList = await getRolePermession({ userName: this.name });
        if (permissionList.data.length > 1) {
          this.permission = "";
        } else {
          this.permission = permissionList.data[0];
        }
      }
      let res = await getInfoByLoginUser({
        flag: this.permission,
        ...this.queryParams,
      });

      this.options.linkProjectOptions = res.list;
      this.tableData = res.list;
      // this.tableData.forEach(item => (item.hasChildren = true));
    },
    // 获取负责人列表
    getUserlist() {
      getUserList().then((res) => {
        this.userListData = res.rows;
        this.totalUser = res.total;
      });
    },
    // 详情
    getDetail(row) {
      this.$router.push({
        path: "/projectIndex/detail/" + row.id,
      });
    },
    // 搜索 缺少接口
    search() {
      this.getList();
    },
    // 新增表单 取消
    cancelProject() {
      this.$refs["projectForm"].resetFields();
      this.$set(this.projectForm, "xmbAddress", "");
      this.$set(this.projectForm, "longitude", "");
      this.$set(this.projectForm, "latitude", "");
      this.projectForm = {};
      this.dialogVisibleProject = false;
    },

    // 新增表单 提交
    submitProjectForm() {
      this.$refs["projectForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          addProject(this.projectForm).then((res) => {
            if (this.projectForm.isParent) {
              if (this.childrenMap.get(this.projectForm.linkProjectId))
                this.resetLazyTree(this.projectForm.linkProjectId);
            } else {
              this.getList();
            }
            this.$message.success("添加成功");
            this.loading = false;

            this.cancelProject();
          });
        }
      });
      // 添加项目
    },
    //弹出新增
    handleAdd() {
      this.dialogTitle = "新增项目";
      this.dialogVisibleProject = true;
    },
    // 任务组名字典翻译
    projectTypeFormat(row, column) {
      return this.selectDictLabel(
        this.options.projectTypeOptions,
        row.projectType
      );
    },
    // 获取子列表
    loadChildrenList(tree, treeNode, resolve) {
      this.childrenMap.set(tree.id, { tree, treeNode, resolve });
      getChildrenProject(tree.id).then((res) => {
        resolve(res.data);
      });
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.getList();
    },
    handleFileUploadProgress() {
      this.upload.isUploading = true;
    },
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      addBanner({
        project_id: this.currentProjectID,
        file_id: response.data.file_id
      })
    },
    // Banner弹窗
    async showBanner(index, row) {
      let {data} = await bannerList(row.id);

      this.upload = {
        ...this.upload,
        fileList: data.map(item => ({name: item.file_name, url: item.file_path}))
      }
      this.dialogVisibleBanner = true;
      this.currentProjectID = row.id;
      this.currentLinkID = row.linkProjectId;
    },

    handleCloseBanner() {
      this.dialogVisibleBanner = false;
      this.upload = {
        ...this.upload,
        fileList: []
      }
    },

    // 指派项目经理弹窗
    assignManager(index, row) {
      this.dialogVisibleManager = true;
      this.currentProjectID = row.id;
      this.currentLinkID = row.linkProjectId;
      this.multipleSelection = row.linkUserId.split(",");
    },

    // 指派项目经理弹窗清空
    handleCloseManager() {
      this.currentProjectID = "";
      this.multipleSelection = [];
      this.currentLinkID = "";
      this.dialogVisibleManager = false;
    },
    // 指派项目经理提交
    submitManager() {
      //提交指派
      let linkUserId = this.multipleSelection.join(",");
      let data = {
        id: this.currentProjectID,
        linkUserId: linkUserId,
      };
      updateUserList(data).then((res) => {
        this.msgSuccess(res.msg);
      });
      this.resetLazyTree(this.currentLinkID);
      this.handleCloseManager();
    },
    //编辑项目
    editProject(row) {
      this.dialogTitle = "编辑项目";
      this.dialogVisibleProject = true;
      this.currentProjectIdEdit = row.id;
      this.isEdit = true;
      getProjectInfo(this.currentProjectIdEdit).then((res) => {
        this.projectForm = res.data;
      });
    },
    // 编辑表单 提交
    submitProjectFormEdit() {
      this.$refs["projectForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          updateProject(this.projectForm).then((res) => {
            if (this.projectForm.isParent) {
              if (this.childrenMap.get(this.projectForm.linkProjectId))
                this.resetLazyTree(this.projectForm.linkProjectId);
            } else {
              this.getList();
            }
            this.$message.success("修改成功");
            this.loading = false;

            this.cancelProject();
          });
        }
      });
      // 添加项目
    },
    resetLazyTree(pid) {
      // 刷新子项目列表
      const { tree, treeNode, resolve } = this.childrenMap.get(pid);
      this.$set(this.$refs.projectlist.store.states.lazyTreeNodeMap, pid, []);
      this.loadChildrenList(tree, treeNode, resolve);
    },

    jumpToManage(todoType, row) {
      this.$router.push({
        path: "/projectIndex/module/" + this.moduleMap[todoType] + "/" + row.id,
      });
    },
    changeAddress(currentAddress) {
      this.$set(this.projectForm, "xmbAddress", currentAddress.address);
      this.$set(this.projectForm, "longitude", currentAddress.lng);
      this.$set(this.projectForm, "latitude", currentAddress.lat);
      // console.log(this.projectForm);
      this.$refs.projectForm.validateField("xmbAddress", (value) => {
        // console.log(value);
      });
    },
  },
};
</script>

<style>
</style>
