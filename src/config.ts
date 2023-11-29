import * as defaultConfig from "../defaultConfig.json";

class ConfigService {
	// reads config from a json file. the json file is specified by in the env variable CONFIG_PATH
	// if CONFIG_PATH is not set, it will default to defaultConfig.json
	private config: any;
	constructor() {
		// TODO make this work
		// const defaultConfigPath = "@/defaultConfig.json";
		// this.config = require(process.env.CONFIG_PATH ?? defaultConfigPath);
		this.config = (defaultConfig as any).default;
		console.log("yhis config", this.config);
	}
	get(key: string) {
		console.log(this.config, "!!!!");
		return this.config[key];
	}
	getUrl(key: string) {
		return require(this.get(key));
	}
}

const configService = new ConfigService();
export default configService;
