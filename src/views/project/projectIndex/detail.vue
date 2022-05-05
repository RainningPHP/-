<template>
  <div>
    <div class="detail-info">
      <div class="detail-info-name">
        <template v-if="projectInfo.isParent">
          {{ projectInfo.parentName }}
          <span v-if="projectInfo.isParent"
            >({{ projectInfo.projectName }})</span
          >
        </template>
        <template v-else>{{ projectInfo.projectName }}</template>
      </div>
      <el-col :span="12">
        项目编号：
        <span>{{ projectInfo.projectNo }}</span>
      </el-col>
      <el-col :span="12">
        项目建设类别：
        <span>{{ projectInfo.projectType | eleLevelFormat(this) }}</span>
      </el-col>
      <el-col :span="12">
        电压等级：
        <span>{{ projectInfo.projectDyLevel | defaultFormat }}</span>
      </el-col>
      <el-col :span="12">
        单项工程类型：
        <span>{{ projectInfo.projectDxgcType | dxLevelFormat(this) }}</span>
      </el-col>
    </div>
    <!-- 项目前期 -->
    <div class="detail-stage" v-for="item in stagePart" :key="item.id">
      <div class="detail-stage-title">{{ item.dictLabel }}</div>
      <div class="detail-stage-content">
        <div
          class="detail-stage-content-part"
          v-for="todo in item.todo"
          :key="todo.id"
        >
          <div class="detail-stage-content-part-title float-left">
            {{ todo.dictLabel }}
          </div>
          <div
            class="detail-stage-content-part-info"
            v-for="fin in manageList"
            :key="fin.id"
          >
            <template v-if="todo.dictLabel === fin">
              <el-button
                type="primary"
                size="mini"
                class="float-right"
                @click="jumpToManage(todo.dictLabel)"
                >查看</el-button
              >
            </template>
          </div>

          <div
            class="detail-stage-content-part-info"
            v-for="fin in Object.keys(hasChildrenList)"
            :key="fin.id"
          >
            <template v-if="todo.dictLabel === fin">
              <el-popover placement="top" width="500" trigger="click">
                <div class="popoverModule">
                  <template v-for="child in options[hasChildrenList[fin]]">
                    <el-button
                      slot="reference"
                      v-if="childManageList.indexOf(child.dictLabel) !== -1"
                      type="primary"
                      size="mini"
                      min-width="25%"
                      :key="child.id"
                      @click="jumpToManage(child.dictLabel)"
                      >{{ child.dictLabel }}</el-button
                    >
                    <el-button
                      slot="reference"
                      v-else
                      size="mini"
                      min-width="25%"
                      :key="child.id"
                      disabled
                      @click="jumpToManage(child.dictLabel)"
                      >{{ child.dictLabel }}</el-button
                    >
                  </template>
                </div>
                <el-button
                  slot="reference"
                  type="primary"
                  size="mini"
                  class="float-right"
                  >查看</el-button
                >
              </el-popover>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProjectInfo } from "@/api/project/project_php.js";
import { mapGetters } from "vuex";
export default {
  name: "projectdetail",
  data() {
    return {
      projectId: this.$route.params.id,
      projectInfo: {},
      stagePart: [],
      options: {
        eleLevelOption: [],
        dxLevelOption: [],
      },
      // 开发完成删除
      manageList: [
        "可研评审",
        "项目核准",
        "支撑性文件",
        "初步设计",
        "设计招标",
        "监理招标",
        "物资计划上报",
        "施工招标",
        "队伍管理",
        "组建业主项目部",
        "四通一平",
        "人员管理",
        "行政许可手续办理",
        "前期成果",
      ],
      childManageList: [
        // "停电计划",
        "物资计划",
        "坐标信息",
        "e安全考勤",
        "合同管理",
        "属地办证",
        "图纸交付",
        "建设进度计划",
        "安全检查",
        "质量检查",
        "第一次工地例会",
        "实时进度",
        "颗粒度履职管理",
        "会议信息",
        "监督检查",
        "质量抽查",
        "施工计划",
        "设计计划",
        "停电计划",
        "政处需求调查",
        "跨越工作",
        "月度计划",
        "周报上报",
      ],
      // 含子项目模块
      hasChildrenList: {
        进度管理: "jd_manage",
        安全管理: "aq_manage",
        质量管理: "zl_manage",
        物资管理: "wz_manage",
        造价管理: "zj_manage",
        技术管理: "js_manage",
      },
    };
  },
  created() {
    this.getInfo();
    this.showDict();
  },
  computed: {
    ...mapGetters(["moduleMap"]),
  },
  methods: {
    getInfo() {
      getProjectInfo(this.projectId).then((res) => {
        this.projectInfo = res.data;
        if (res.data.isParent) {
          getProjectInfo(res.data.linkProjectId).then((res) => {
            this.$set(this.projectInfo, "parentName", res.data.projectName);
          });
        }
      });
    },
    showDict() {
      this.getDicts("project_stage").then((res) => {
        this.stagePart = res.data;
        this.stagePart.forEach((item, index) => {
          this.getDicts("project_stage_todo_" + (index + 1)).then((res) => {
            item.todo = res.data;
            this.$forceUpdate();
          });
        });
      });
      this.getDicts("project_type").then((res) => {
        this.options.eleLevelOption = res.data;
      });

      this.getDicts("project_dxgc_type").then((res) => {
        this.options.dxLevelOption = res.data;
      });
      this.getDicts("jd_manage").then((res) => {
        this.options.jd_manage = res.data;
      });

      this.getDicts("aq_manage").then((res) => {
        this.options.aq_manage = res.data;
      });

      this.getDicts("zl_manage").then((res) => {
        this.options.zl_manage = res.data;
      });

      this.getDicts("wz_manage").then((res) => {
        this.options.wz_manage = res.data;
      });

      this.getDicts("zj_manage").then((res) => {
        this.options.zj_manage = res.data;
      });
      this.getDicts("js_manage").then((res) => {
        this.options.js_manage = res.data;
      });
    },
    jumpToManage(todoType) {
      console.log()
      this.$router.push({
        path:
          "/projectIndex/module/" +
          this.moduleMap[todoType] +
          "/" +
          this.projectId,
      });
    },
  },

  filters: {
    // 项目建设类别：
    eleLevelFormat: (value, vm) => {
      if (value === undefined || value === null) {
        return "-";
      } else {
        return vm.selectDictLabel(vm.options.eleLevelOption, value);
      }
    },
    dxLevelFormat: (value, vm) => {
      if (value === undefined || value === null) {
        return "-";
      } else {
        return vm.selectDictLabel(vm.options.dxLevelOption, value);
      }
    },
    defaultFormat(value) {
      if (value === undefined || value === null) {
        return "-";
      } else {
        return value;
      }
    },
  },
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
      padding-bottom: 20px;
    }
  }
  &-stage {
    font-size: 14px;
    line-height: 2;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    &:last-child {
      border-bottom: none;
    }
    &-title {
      padding: 20px 20px 0 20px;
      font-size: 16px;
      font-weight: bold;
    }
    &-content {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 20px;
      &-part {
        width: 25%;
        padding: 20px;
        border-top: 1px solid #eee;
        border-right: 1px solid #eee;
        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(4) {
          border-top: none;
        }
        &:nth-child(4n) {
          border-right: none;
        }
        // &-title {
        //   font-weight: bold;
        // }
      }
    }
  }
}
.popoverModule {
  display: flex;
  flex-flow: wrap;
  justify-content: space-around;
  button {
    min-width: 25%;
    margin-top: 10px;
  }
}
</style>
