import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const dictMap = new Vuex.Store({
    state: {
        moduleMap: {
            可研评审: 'kyps',
            项目核准: 'xmhz',
            支撑性文件: 'zcxwj',
            初步设计: 'cbsj',
            组建业主项目部: 'zjyzxmb',
            进度管理: 'jdgl',
            停电计划: 'tdjh',
            物资计划: 'wzjh',
            施工计划: 'sgjh',
            设计计划: 'sjjh',
            属地办证: 'sdbz',
            坐标信息: 'zbxx',
            "设计招标": 'sjzb',
            "监理招标": 'jlzb',
            "物资计划上报": 'wzjhsb',
            "施工招标": 'sgzb',
            "e安全考勤": 'eaqkq',
            "合同管理": 'htgl',
            "图纸交付": 'tzjf',
            "建设进度计划": 'jsjdjh',
            "安全检查": 'aqjc',
            "质量检查": 'zljc',

            '第一次工地例会': 'dycgdlh',
            '实时进度': "ssjd",
            '颗粒度履职管理': 'kldlzgl',
            '会议信息': 'hyxx',
            '监督检查': 'jdjc',
            '质量抽查': 'zlcc',
            '队伍管理': 'dwgl',

            '四通一平': 'styp',
            '政处需求调查': 'zcxqdc',
            "跨越工作": 'kygz',
            "月度计划": 'ydjh',

            "周报上报": 'zbsb',

            "人员管理": 'rygl',

            '行政许可手续办理': 'xzxk',
            '前期成果': 'qqcg',


        },

    },
})
export default dictMap
