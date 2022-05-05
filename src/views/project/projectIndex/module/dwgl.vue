<template>
  <div>
    <div class="detail-info">
      <div class="detail-info-name">{{ projectInfo? projectInfo.projectName:''}}</div>
    </div>
    <div class="query app-container">
      <div class="query-part">
        <div class="query-title">业主单位</div>
        <div class="btn-group" v-if="data">
          <template v-if="data.list1.length && !yzData.isEditing">
            <div class="query-unit">{{data.list1[0].dwName}}</div>
            <div class="query-btn">
              <el-button type="warning" icon="el-icon-edit" circle @click="editZrr('yzData',1)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="delZrr('yzData',1)"></el-button>
            </div>
          </template>
          <template v-else-if="yzData.isEditing">
            <el-input v-model="yzData.dwName" placeholder="请输入业主单位"></el-input>
            <div class="query-btn">
              <el-button type="success" icon="el-icon-check" circle @click="updateZrr('yzData',1)"></el-button>
              <el-button type="info" circle icon="el-icon-close" @click="cancelZrr('yzData')"></el-button>
            </div>
          </template>
          <template v-else>
            <el-input v-model="yzData.dwName" placeholder="请输入业主单位"></el-input>

            <el-button type="primary" circle icon="el-icon-plus" @click="addZrr('yzData')"></el-button>
          </template>
        </div>
      </div>
      <div class="query-part">
        <div class="query-title">监理单位</div>
        <div v-if="data">
          <div class="btn-group">
            <el-input v-model="jlData.dwName" placeholder="请输入施工单位"></el-input>
            <el-button type="primary" circle icon="el-icon-plus" @click="addZrr('jlData')"></el-button>
          </div>
          <template v-if="data && data.list2.length">
            <div v-for="item in data.list2" :key="item.id" class="btn-group">
              <template>
                <div class="query-unit">{{item.dwName}}</div>
                <el-button type="danger" icon="el-icon-delete" circle @click="delZrrSec(item)"></el-button>
              </template>
            </div>
          </template>
        </div>
      </div>
      <div class="query-part">
        <div class="query-title">施工单位</div>
        <div v-if="data">
          <div class="btn-group">
            <el-input v-model="sgData.dwName" placeholder="请输入施工单位"></el-input>
            <el-button type="primary" circle icon="el-icon-plus" @click="addZrr('sgData')"></el-button>
          </div>
          <template v-if="data && data.list3.length">
            <div v-for="item in data.list3" :key="item.id">
              <div class="btn-group">
                <div class="query-unit">{{item.dwName}}</div>
                <el-button type="danger" icon="el-icon-delete" circle @click="delZrrSec(item)"></el-button>
              </div>
              <!-- 分包单位 -->
              <div>
                <div class="query-sec">
                  <div class="query-title">专业分包</div>
                  <div class="btn-group">
                    <el-input v-model="zyData.dwName" placeholder="请输入专业分包单位"></el-input>

                    <el-button
                      type="primary"
                      circle
                      icon="el-icon-plus"
                      @click="addZrrSec('zyData',item)"
                    ></el-button>
                  </div>
                  <template v-if="item.zyfbList.length ">
                    <div v-for="itemChild in item.zyfbList " :key="itemChild.id" class="btn-group">
                      <template>
                        <div class="query-unit">{{itemChild.dwName}}</div>
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          circle
                          @click="delZrrSec(itemChild)"
                        ></el-button>
                      </template>
                    </div>
                  </template>
                </div>
                <div class="query-sec">
                  <div class="query-title">劳务分包</div>

                  <div class="btn-group">
                    <el-input v-model="lwData.dwName" placeholder="请输入专业分包单位"></el-input>
                    <el-button
                      type="primary"
                      circle
                      icon="el-icon-plus"
                      @click="addZrrSec('lwData',item)"
                    ></el-button>
                  </div>
                  <template v-if="item.lwfbList.length ">
                    <div v-for="itemChild in item.lwfbList " :key="itemChild.id" class="btn-group">
                      <template v-if=" !lwData.isEditing">
                        <div class="query-unit">{{itemChild.dwName}}</div>
                        <div>
                          <el-button
                            type="danger"
                            icon="el-icon-delete"
                            circle
                            @click="delZrrSec(itemChild)"
                          ></el-button>
                        </div>
                      </template>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="query-part">
        <div class="query-title">设计单位</div>
        <div v-if="data">
          <div class="btn-group">
            <el-input v-model="sjData.dwName" placeholder="请输入施工单位"></el-input>
            <el-button type="primary" circle icon="el-icon-plus" @click="addZrr('sjData')"></el-button>
          </div>
          <template v-if="data && data.list4.length">
            <div v-for="item in data.list4" :key="item.id" class="btn-group">
              <template>
                <div class="query-unit">{{item.dwName}}</div>
                <el-button type="danger" icon="el-icon-delete" circle @click="delZrrSec(item)"></el-button>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProjectInfo } from "@/api/project/project.js";
import {
  getZrrList,
  addZrrList,
  delZrrList,
  updateZrrList
} from "@/api/project/project.js";
export default {
  name: "dwgl",
  data() {
    return {
      projectId: this.$route.params.projectId,
      data: null,
      projectInfo: null,

      yzData: {
        dwType: "业主单位",
        dwName: "",
        isEditing: false
      },
      jlData: {
        dwType: "监理单位",
        dwName: ""
      },
      sgData: {
        dwType: "施工单位",
        dwName: ""
      },
      zyData: {
        dwType: "专业分包",
        dwName: ""
      },

      lwData: {
        dwType: "劳务分包",
        dwName: ""
      },
      sjData: {
        dwType: "设计单位",
        dwName: ""
      }
    };
  },
  created() {
    this.getInfo();
    this.getList();
  },
  methods: {
    getInfo() {
      getProjectInfo(this.projectId).then(res => {
        this.projectInfo = res.data;
      });
    },
    // 获取队伍
    getList() {
      getZrrList({ projectId: this.projectId }).then(res => {
        this.data = res;
      });
    },
    // 一级新增
    addZrr(data) {
      if (!this[data].dwName) {
        this.msgError("不能为空");
        return;
      }
      this[data].projectId = this.projectId;
      this[data].projectName = this.projectInfo.projectName;
      addZrrList(this[data]).then(res => {
        this.getList();
        this[data].dwName = "";
      });
    },
    // 一级修改

    updateZrr(data, index) {
      if (!this[data].dwName) {
        this.msgError("不能为空");
        return;
      }
      this[data].projectId = this.projectId;
      this[data].id = this.data["list" + index][0].id;
      this[data].projectName = this.projectInfo.projectName;
      this[data].isEditing = false;
      updateZrrList(this[data]).then(res => {
        this.getList();
        this[data].dwName = "";
      });
    },
    // 一级删除
    delZrr(data, index) {
      delZrrList([this.data["list" + index][0].id]).then(res => {
        this.getList();
      });
    },
    // 一级编辑
    editZrr(data, index) {
      this[data].dwName = this.data["list" + index][0].dwName;
      this[data].isEditing = true;
    },
    // 一级取消
    cancelZrr(data) {
      this[data].dwName = "";
      this[data].isEditing = false;
    },

    // 二级新增
    addZrrSec(data, item) {
      if (!this.data.list3.length) {
        this.msgError("请先添加施工单位");
        return;
      }
      if (!this[data].dwName) {
        this.msgError("不能为空");
        return;
      }
      this[data].projectId = this.projectId;
      this[data].projectName = this.projectInfo.projectName;
      this[data].parentId = item.id;
      addZrrList(this[data]).then(res => {
        this.getList();
        this[data].dwName = "";
      });
    },

    // 二级删除
    delZrrSec(item) {
      delZrrList([item.id]).then(res => {
        this.getList();
      });
    },

    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.getList();
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
    }
  }
};
</script>
<style lang="scss" scoped>
.detail {
  &-info {
    font-size: 14px;
    line-height: 2;
    padding: 20px;
    background: #fff;
    box-shadow: 0 5px 5px #eee;
    border-bottom: 1px solid #eee;
    overflow: hidden;
    &-name {
      font-size: 20px;
      font-weight: bold;
      line-height: 1.5;
    }
  }
}
.query {
  &-title {
    font-size: 20px;
    line-height: 2;
  }
  &-part {
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
  }
  &-sec {
    margin-left: 40px;
    .query-title {
      line-height: 36px;
    }
  }
  &-btn {
    width: 90px;
  }
  &-unit {
    width: 70%;
    margin-right: 20px;

    line-height: 2.5;
    background: #f5f5f5;
    border-radius: 5px;
    padding: 0 10px;
  }
}
.btn-group {
  display: flex;
  justify-content: left;
  align-items: center;
  .el-input {
    width: 70%;
    margin-right: 20px;
  }
}
</style>