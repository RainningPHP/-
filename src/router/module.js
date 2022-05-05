function addModuelRoutes() {
    const files = require.context('@/views/project/projectIndex/module/', true, /\.vue$/)
    let pages = {};
    files.keys().forEach(key => {
        pages[key.replace(/(\.\/|\.vue)/g, '')] = files(key).default;
    })
    let moduleToChMap = {
        kyps: '可研评审',
        xmhz: '项目核准',
        zcxwj: '支撑性文件',
        cbsj: '初步设计',
        jdgl: '进度管理',
        tdjh: '停电计划',
        wzjh: '物资计划',
        sgjh: '施工计划',
        sjjh: '设计计划',
        sdbz: '属地办证',
        zbxx: '坐标信息',
        zjyzxmb: '组建业主项目部',
        "sjzb": '设计招标',
        "jlzb": '监理招标',
        "wzjhsb": '物资计划上报',
        "sgzb": '施工招标',
        "eaqkq": 'e安全考勤',
        "htgl": '合同管理',
        "tzjf": '图纸交付',
        "jsjdjh": '建设进度计划',
        "aqjc": '安全检查',
        "zljc": '质量检查',
        'dycgdlh': '第一次工地例会',
        'ssjd': '实时进度',
        'kldlzgl': '颗粒度履职管理',
        'hyxx': '会议信息',
        'jdjc': '监督检查',
        'zlcc': '质量抽查',
        'dwgl': '队伍管理',
        'styp': '四通一平',
        'zcxqdc': '政处需求调查',
        'kygz': "跨越工作",
        'ydjh': "月度计划",
        'zbsb': '周报上报',
        'rygl': '人员管理',
        'xzxk': '行政许可手续办理',
        'qqcg': '前期成果',
    }
    //生成路由规则
    let generator = [];
    Object.keys(pages).forEach(item => {
        let name = pages[item].name ? pages[item].name : item
        generator.push({
            path: pages[item].name ? `module/${pages[item].name.replace(/-/g, '/')}/:projectId` : `module/${item.replace(/-/g, '/')}/:projectId`,
            name: name,
            component: pages[item],
            meta: {
                title: moduleToChMap[name]
            }
        })
    });
    return generator
}
export default addModuelRoutes
