/**
 * 一个高级的场景管理器通常还包括以下功能

    场景切换效果： 提供场景切换时的淡入淡出、过渡动画等效果，以增强游戏的视觉吸引力。

    异步加载资源： 能够异步加载场景和场景所需的资源，以确保游戏性能和加载速度。

    场景堆栈管理： 支持场景的堆栈管理，使得可以回到上一个场景，或者在需要时回到特定的场景。

    场景数据传递： 在不同场景之间传递数据，以实现场景之间的交互和通信。

    性能优化： 对资源加载和卸载进行优化，以减少内存占用和提高游戏性能。

    自动释放资源： 在不需要的场景中自动释放不再使用的资源，以节省内存。
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneManager extends cc.Component {

    /**加载界面 */
    @property(cc.Node)
    private loadingScreen: cc.Node = null;

    /**当前场景名称 */
    private currentScene: string = "";
    /**是否正在加载场景 */
    private isLoading: boolean = false;

    /**预加载的场景名称列表 */
    @property([cc.String])
    private preloadScene: string[] = [];

    //生命周期
    onLoad() {
        cc.game.addPersistRootNode(this.node);
        //注册一个场景加载完成的回调
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLoaded, this);

        //预加载所有场景
        this.preloadScene.forEach((sceneName) => {
            cc.director.preloadScene(sceneName, () => {
                cc.log("预加载场景完成：" + sceneName);
            });
        });
    }

    /**切换场景 */
    public async switchScene(sceneName: string) {
        if (this.isLoading) {
            cc.warn("正在加载场景，请稍后再试！");
            return;
        }
        if (this.currentScene === sceneName) {
            cc.warn("已在场景${sceneName}中，无需切换！");
            return;
        }
        this.isLoading = true;
        this.loadingScreen.active = true;

        await this.waitTwoSeconds();
        cc.director.loadScene(sceneName);
      
    }

    async waitTwoSeconds(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        })
    }
    /**场景加载完成后的回调 */
    private onSceneLoaded(event: cc.Event.EventCustom) {
        this.isLoading = false;
        this.loadingScreen.active = false;

        const newSceneName: string = cc.director.getScene().name;
        cc.log(`已切换到场景：${newSceneName}`);
        this.currentScene = newSceneName;
    }

}
