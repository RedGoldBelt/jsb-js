import Config from "./config";

export default abstract class Configurable {
    abstract getConfig(): Config;

    abstract setConfig(config: Config): this;
}