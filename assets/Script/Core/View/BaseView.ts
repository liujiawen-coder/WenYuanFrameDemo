const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseView extends cc.Component {

    private _visible = false;

    public async _open(...param: any[]): Promise<void> {
        this.node.active = true;
        await this.open(...param);
    }
    protected async open(...param: any[]): Promise<void> {

    }

    public async _close(): Promise<void> {
        this.node.active = true;
        this.close();
    }
    protected close() {

    }

    public _show() {
        if (this._visible) return;
        this._visible = this.node.active = true;
        this.onShow();
    }
    protected onShow() {

    }
    public _hide() {
        if (!this._visible) return;
        this._visible = this.node.active = false;
        this.onhide();
    }
    protected onhide() {

    }


    protected start() {
        
    }
}
