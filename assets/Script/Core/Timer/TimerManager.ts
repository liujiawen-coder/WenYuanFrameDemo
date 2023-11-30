/**
 * 计时器管理器在独立游戏开发中具有重要作用。
 * 它不仅使游戏开发更加有条理，而且提供了一个高效、可扩展的方式来处理复杂的时间管理问题。
 * 通过使用计时器管理器，开发者可以更好地控制时间逻辑，优化性能，实现协同效果，从而为玩家创造出更加精彩的游戏体验。
 * 无论是小型独立游戏还是大型多人在线游戏，计时器管理器都是一个不可或缺的工具，有助于提升游戏的质量和可维护性。
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class TimerManager extends BaseClass {

    private _timerList: ITimer[] = [];
    private _currTime: number;
    private _currFrame: any;
    static ins(): TimerManager {
        return super.ins() as TimerManager;
    }
    public init() {
        this._timerList = [];
        this._currTime = cc.director.getTotalTime();
        this._currFrame = 0;
        cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, this.update, this);
    }

    /**更新计时器 */
    update(dt) {
        let self = this;
        self._currFrame++;
        self._currTime = cc.director.getTotalTime();
        let curTime = 0;
        for (let i = 0; i < this._timerList.length; i++) {
            let timer = this._timerList[i];
            if (timer.tick <= self._currTime) {
                timer.func.call(timer.target);
                curTime = cc.director.getTotalTime();
                timer.tick = curTime + timer.interval;

                if (timer.repeat > 0) {
                    timer.repeat--;
                    if (timer.repeat === 0) {
                        this._timerList.splice(i, 1);
                        i--;
                    }
                }
            }
        }
    }

    /**定时执行，第一次会延迟interval
        * @param interval 执行间隔
        * @param repeat 重复次数,-1为无限次
        * @param func 执行函数
        * @param target 执行函数目标
        * @param callback 完成回调
        * @param callbackObj 完成回调目标
        */
    public doTimer(interval: number, repeat: number, func: Function, target: Object, callback: Function = null, callbackObj: Object = null) {
        this.add(interval, interval, repeat, func, target, callback, callbackObj);
    }

    /**
     * 添加计时器
     * @param interval 执行间隔
     * @param repeat 重复次数
     * @param func 执行函数
     * @param target 执行函数目标
     */
    public add(startTime: number, interval: number, repeat: number, func: Function, target: Object, callback: Function, callbackObj: Object) {
        if (interval < 0 || repeat == 0 || func == null)
            return;

        console.log(`add`);
        if (CC_DEBUG) {
            for (let i = 0; i < this._timerList.length; i++) {
                let timer = this._timerList[i];
                if (timer.func === func && timer.target === target) {
                    cc.warn("重复添加计时器！");
                    return;
                }
            }
        }
        let timer: ITimer = {
            tick: startTime + this._currTime,
            interval: interval,
            repeat: repeat,
            func: func,
            target: target,
            callback: null,
            callbackObj: null,
        };
        this._timerList.push(timer);
    }

    /**删除计时器 */
    public remove(func: Function, target: Object) {
        for (let i = 0; i < this._timerList.length; i++) {
            let timer = this._timerList[i];
            if (timer.func === func && timer.target === target) {
                this._timerList.splice(i, 1);
                return;
            }
        }
    }

    /**删除所有计时器
    * @param target 需要移除的目标
    */
    public removeAll(target: object) {
        for (let i = this._timerList.length; i >= 0; i--) {
            let timer = this._timerList[i];
            if (timer.target === target) {
                this._timerList.splice(i, 1);
            }
        }
    }
    /**检测是否已有计时器 */
    public isExists(func: Function, target: Object) {
        for (let i = 0; i < this._timerList.length; i++) {
            let timer = this._timerList[i];
            if (timer.func === func && timer.target === target) {
                return true;
            }
        }
        return false;
    }


}

interface ITimer {
    /**执行时间戳 */
    tick: number;
    /**计时间隔 */
    interval: number;
    /**计时重复次数，-1时无限次调用 */
    repeat: number;
    /**调用方法 */
    func: Function;
    /**调用方法目标 */
    target: Object;
    callback: Function;
    callbackObj: Object;
}