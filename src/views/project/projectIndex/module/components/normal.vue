<template></template>

<script>
import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
import { getProjectInfo, commonDownload } from "@/api/project/project.js";
export default {
  data() {
    return {
      projectId: this.$route.params.projectId,
      type: this.$route.params.type,
      isParent: 1,
      // 用户导入参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/common/upload",
        // 上传的文件列表
        fileList: []
      },
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      form: {},
      rules: {},
      tableData: [],
      // 新增
      dialogVisible: false,
      multiple: true,
      ids: [],
      single: false,
      projectData: {},

      currentForm: {}
    };
  },
  created() {
    this.getList();
    this.getInfo();
  },

  methods: {
    getInfo() {
      getProjectInfo(this.projectId).then(res => {
        this.projectData = res.data;
        this.isParent = res.data.isParent;
      });
    },
    handleAdd() {
      this.upload.fileList = [];
    },

    handleUpdate(row) {
      this.upload.fileList = [
        { name: this.form.fileName, url: this.form.filePath }
      ];
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      if (this.fileIdChange) {
        this.fileIdChange(response);
      } else {
        this.$set(this.fileForm, "fileId", response.fileId);
        this.$refs.upload.clearValidate("fileId");
      }
      this.fileForm.projectId = this.projectId;
      let time = parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}");
      this.fileForm.operTime = time;
    },
    // 文件下载处理
    handleDownload(row) {
      commonDownload(row.fileId);
    },
    // 新增弹窗
    showAdd() {
      this.dialogVisible = true;
    },
    // 弹窗关闭清空
    handelCancel() {
      this.upload.fileList = [];
      this.$refs.upload.resetFields();
      this.dialogVisible = false;
      this.fileForm = {};
    },
    submitSuccess() {
      this.handelCancel();
      this.getList();
    },

    // 多选
    handleSelectionChange(selection) {
      this.multiple = !selection.length;
      this.single = selection.length != 1;
      this.ids = selection.map(item => item.id);
      if (this.single) {
        this.currentForm = {};
      } else {
        this.currentForm = selection[0];
      }
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

<style>
</style>