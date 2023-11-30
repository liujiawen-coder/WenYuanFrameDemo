import EventMgr from "./Core/Event/EventMgr";
import TimerManager from "./Core/Timer/TimerManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    /**目标场景名称 */
    @property
    private targetScene: string = "";
    timer: any = 0;

    start() {
        // init logic
        this.label.string = this.text;

        //注册点击事件
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            //获取SceneManager组件并切换场景
            const sceneManager = cc.find("SceneManager").getComponent("SceneManager");
            sceneManager.switchScene(this.targetScene);
        }, this);


        let timerMgr = TimerManager.ins();
        timerMgr.init();
        timerMgr.doTimer(1000, -1, this.timerFun, this);


        EventMgr.on("test", this.test, this);
    }

    test() {
        console.log("test");
    }
    private timerFun() {
        this.timer++;
        this.label.string = this.timer.toString();
    }
}
