<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
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
      v-if="projectData.projectType == 1"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="bdzName" label="变电站名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="longitude" label="经度" :show-overflow-tooltip="true" width="100"></el-table-column>
      <el-table-column prop="latitude" label="纬度" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="address" label="地址" :show-overflow-tooltip="true"></el-table-column>
    </el-table>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      v-else-if="projectData.projectType == 2 || projectData.projectType == 3"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="tNo" label="塔号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="zNo" label="桩号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="tgType" label="杆塔型式" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="isJy" label="是否架构/借用塔" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="longitude" label="经度" :show-overflow-tooltip="true" width="100"></el-table-column>
      <el-table-column prop="latitude" label="纬度" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="address" label="地址" :show-overflow-tooltip="true"></el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :data="{projectId,updateSupport:upload.updateSupport}"
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
    <!-- 修改坐标信息对话框 -->
    <el-dialog title="修改坐标信息" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row v-if="projectData.projectType == 1">
          <el-col :span="12">
            <el-form-item label="变电站名称">{{form.bdzName}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <!-- <el-input v-model="form.address"></el-input> -->
              <select-address
                @changeAdd="changeAddress"
                :address.sync="form.address"
                :lng.sync="form.longitude"
                :lat.sync="form.latitude"
              ></select-address>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="经度">{{form.longitude}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="纬度">{{form.latitude}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-row v-else>
          <el-col :span="12">
            <el-form-item label="塔号">{{form.tNo}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="桩号">{{form.zNo}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="杆塔型式">{{form.tgType}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否架构/借用塔">{{form.isJy}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <!-- <el-input v-model="form.address"></el-input> -->
              <select-address
                @changeAdd="changeAddress"
                :address.sync="form.address"
                :lng.sync="form.longitude"
                :lat.sync="form.latitude"
              ></select-address>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="经度">{{form.longitude}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="纬度">{{form.latitude}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </el-col>-->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
import mixin from "./components/normal.vue";
import { deepClone } from "@/utils/index";
import {
  getZbxxList,
  downloadZbxxDefault,
  updateZbxxList,
  delZbxxFile
} from "@/api/project/project.js";
import SelectAddress from "@/components/Map/AMap/SelectAddress.vue";
export default {
  name: "zbxx",
  mixins: [mixin],
  components: { SelectAddress },
  data() {
    let addressValid = (rule, value, callback) => {
      if (!this.form.address) {
        return callback("请选择选择地址");
      } else {
        return callback();
      }
    };
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
        url: process.env.VUE_APP_BASE_API + "/system/tower/importData",
        // 上传的文件列表
        fileList: [],

        updateSupport: false
      },
      title: "",
      open: false,
      rules: {
        address: [
          { required: true, validator: addressValid, trigger: "change" }
        ]
      }
    };
  },
  methods: {
    getList() {
      getZbxxList({ projectId: this.projectId }).then(res => {
        this.tableData = res.rows;
      });
    },

    handleImport() {
      this.upload.title = "坐标信息导入";
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
      downloadZbxxDefault().then(res => {
        this.download(res.msg);
      });
    },
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 删除
    handleDelete() {
      this.$confirm("是否确认删除数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          return delZbxxFile(this.ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleUpdate() {
      this.open = true;
      this.form = deepClone(this.currentForm);
    },

    submitForm() {
      this.$refs.form.validate(value => {
        if (value) {
          updateZbxxList(this.form).then(res => {
            this.cancel();
            this.getList();
            this.msgSuccess(res.msg);
          });
        }
      });
    },
    cancel() {
      this.open = false;
      this.dialogTitle = "";
      this.form = {};
      this.$set(this.form, "address", "");
      this.$set(this.form, "longitude", "");
      this.$set(this.form, "latitude", "");
      this.$refs.form.clearValidate();
    },

    changeAddress(currentAddress) {
      // this.form.address = currentAddress.address;
      // this.form.latitude = currentAddress.lat;
      // this.form.longitude =currentAddress.address;
      console.log(currentAddress);
      this.$set(this.form, "address", currentAddress.address);
      this.$set(this.form, "longitude", currentAddress.lng);
      this.$set(this.form, "latitude", currentAddress.lat);
      // console.log(this.form);
      // this.$refs.form.validateField("address", value => {
      //   // console.log(value);
      // });
    }
  }
};
</script>

<style  lang="scss">
.el-tooltip__popper.is-dark {
  max-width: 80%;
}
</style>