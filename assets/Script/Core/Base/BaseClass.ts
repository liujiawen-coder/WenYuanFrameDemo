/**基类
 */
class BaseClass {
    private static instance: BaseClass = null;

    protected constructor() {
        // 防止通过 new 关键字创建实例
    }

    static ins(): BaseClass {
        if (!BaseClass.instance) {
            BaseClass.instance = new BaseClass();
        }

        return BaseClass.instance;
    }
}
